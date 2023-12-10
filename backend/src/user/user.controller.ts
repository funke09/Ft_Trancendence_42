import { Controller, Get, UseGuards, Request, Res, BadRequestException, Req, Param, NotFoundException, ParseIntPipe, Patch, Body, Delete, Query, HttpStatus, HttpCode, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guard';
import { UserGateway } from './user.gateway';
import { diskStorage } from 'multer';
import path = require('path');
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';

export const storage = {
	storage: diskStorage({
		destination: './uploads/',
		filename: (req, file, cb) => {
			// const userJSON = JSON.stringify(req.user);
			// const userOBJ = JSON.parse(userJSON);

			// const filename: string = userOBJ.id;
			// const extension: string = path.parse(file.originalname).ext;
			// cb(null, `${filename}${extension}`)
		},
	}),
	fileFilter: (req, file, cb) => {
		const allowedExt = ['.jpg', '.png', '.jpeg'];
		const ext = path.extname(file.originalname);
		if (allowedExt.includes(ext.toLocaleLowerCase())) {
			cb(null, true);
		} else {
			cb(new Error('Invalid file extension'));
		}
	},
	limits: {
		fileSize: 10 * 1024 * 1024,
	}
}

@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
	private readonly userService: UserService,
	private readonly userGateway: UserGateway
	) {}

	@Get()
	@ApiQuery({
		name: 'username',
		required: false,
		type: String
	})
	@ApiOkResponse({ description: `Returns an array of User or a specific User if used as query`})
	@ApiNotFoundResponse({ description: `Specific User doesn't exits`})
	@ApiOperation({ summary: `Get all users, you can also use an optional query parameter to get user by username using /user/username=[username]`})
	async getUsers(@Query('username') username: string) {
		if (username)
		{
			const user = await this.userService.findByUsername(username);
			if (!user)
				throw new NotFoundException(`User ${username} does not exist`);
			return (user);
		}
		return await this.userService.findAll();
	}

	@HttpCode(HttpStatus.OK)
	@Post('upload')
	@ApiOperation({ summary: 'Upload an image and updaye the avatar of the user identifed by its JWT'})
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@ApiUnauthorizedResponse({ description: 'No JWT provided of invalid' })
	@ApiOkResponse({ description: 'Profile image of the user has been uploaded'})
	@UseInterceptors(FileInterceptor('file', storage))
	async uploadFile(@UploadedFile() file, @Request() req) {
		if (!file)
			throw new BadRequestException('No file or empty file');
		const user: User = req.user;
		if (req.user.avatar != './uploads/default.png' && path.extname(file.filename) != path.extname(user.avatar))
			this.userService.deleteImg(req.user.avatar);
		await this.userService.update(user.id, {
			avatar: file.path,
		})

	}

	@Get(':id')
	@ApiOperation({ summary: 'Get user by its ID'})
	@ApiOkResponse({ description: 'Returns a User'})
	@ApiNotFoundResponse({ description: 'User with this ID dosen\'t exist'})
	async getUserByID(@Param('id', ParseIntPipe) id: number) {
		const user = await this.userService.findOne(id);

		if (!user)
			throw new NotFoundException(`User with id of ${id} does not exist`);
		return (user);
	}

	@Get(':id/profileImage')
	@ApiOperation({ summary: 'Get the profile image of a user by ID'})
	@ApiOkResponse({ description: 'Returns profile image of the user'})
	@ApiNotFoundResponse({ description: `User with this ID does not exist`})
	async getProfileImage(@Param('id', ParseIntPipe) id: number, @Res() res) : Promise<any> {
		const user = await this.userService.findOne(id);

		if (!user)
			throw new NotFoundException(`User with id of ${id} does not exist`);

		res.sendFile(join(process.cwd(), user.avatar));
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update the user'})
	async update(@Param('id', ParseIntPipe) id: number, @Body() UpdateUserDto: UpdateUserDto) {
		const updatedUser = await this.userService.update(id, UpdateUserDto);
		return updatedUser;
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete user by its ID' })
	async remove(@Param('id', ParseIntPipe) id: number) {
		return await this.userService.remove(id);
	}
}
