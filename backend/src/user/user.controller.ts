import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/utils/Guards';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';
import {
	BanUserDto,
  UnBanUserDto,
  BlockFriendDto,
  CreateChannelDto,
  JoinChannelDto,
  LeaveChannelDto,
  MakeAdminDto,
  UnblockFriendDto,
  UserMuteDto,
  addChannelMemberDto,
  pinDto,
  setPasswordDto,
  setUsernameDto,
  userIdDto,
  KickUserDto,
  UpdatePasswordDto,
} from './user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterService } from './multer.service';
import { ChannelService } from './channel.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly multerService: MulterService,
    private readonly channelService: ChannelService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: any) {
    if (!req.user.id) throw new BadRequestException(req.user.id);
    return this.userService.getUserDataById(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/id/:userId')
  async getUserById(@Req() req: any, @Param('userId') userId: number) {
    const user = await this.userService.getUserById(req.user.id, +userId);
    if (!user) throw new NotFoundException('User not Found');
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('toto/:userID')
  async getBasicUser(@Param('userID') userID: number) {
    if (userID) return await this.userService.getBasicData(+userID);
    throw new NotFoundException('Missing User ID');
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:username')
  async getUserByUsername(@Param('username') username: string) {
    if (!username) throw new BadRequestException('Missing username');
    const user = this.userService.findUserByUsername(username);
    if (user) return user;
    throw new NotFoundException(`${username} not Found`);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/avatar/:id')
  async getAvatar(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getAvataById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getStats/:id')
  async getStats(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    if (!req.user.id) throw new BadRequestException('Missing username');
    return this.userService.getStatsById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/setUsername')
  async setUsername(
    @Res({ passthrough: true }) res: Response,
    @Req() req: any,
    @Body() username: setUsernameDto,
  ) {
    if (!username) throw new BadRequestException('Invalid Username');
    const updatedUser = await this.userService.setUsername(
      req.user.id,
      username.username,
    );
    await this.authService.login(updatedUser, res, true);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/setPassword')
  async setPassword(@Req() req: any, @Body() password: setPasswordDto) {
    if (!password.password) throw new BadRequestException();
    await this.userService.setPassword(req.user.id, password.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/saveAvatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    if (!userId) throw new NotFoundException('User not found');
    if (!file.mimetype.includes('image'))
      throw new BadRequestException('File is not an Image');

    const filePath = await this.multerService.uploadAvatar(file);
    await this.multerService.saveAvatar(userId, filePath);

    return filePath;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/enableTwoFA')
  async enableTwoFA(@Body() userId: userIdDto) {
    if (!userId) throw new NotFoundException('User not found');
    return await this.authService.enableTwoFA(userId.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/verifyTwoFA')
  async verifyTwoFA(@Body() pin: pinDto, @Req() req: any) {
    const userId = req.user.id;
    await this.authService.verifyTwoFA(pin.pin, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/disableTwoFA')
  async disableTwoFA(@Body() userId: userIdDto) {
    if (!userId) throw new NotFoundException('User not found');
    await this.authService.disableTwoFA(userId.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('rejectFriend')
  async rejectFriend(@Req() req: any, @Body() body: any) {
    if (!body || !body.friendUsername)
      throw new HttpException(
        'No username was provided',
        HttpStatus.BAD_REQUEST,
      );
    return this.userService.rejectFriend(req.user.id, body.friendUsername);
  }

  @UseGuards(JwtAuthGuard)
  @Post('blockFriend')
  async blockFriend(@Req() req: any, @Body() body: BlockFriendDto) {
    if (!body || !body.friendID)
      throw new HttpException('Username Invalid', HttpStatus.BAD_REQUEST);
    return this.userService.blockFriend(req.user.id, body.friendID);
  }

  @UseGuards(JwtAuthGuard)
  @Post('unblockFriend')
  async unblockFriend(@Req() req: any, @Body() body: UnblockFriendDto) {
    if (!body || !body.friendID)
      throw new HttpException('Username Invalid', HttpStatus.BAD_REQUEST);
    return this.userService.unblockFriend(req.user.id, body.friendID);
  }

  @UseGuards(JwtAuthGuard)
  @Post('unfriend')
  async unfriend(@Req() req: any, @Body() body: BlockFriendDto) {
    if (!body || !body.friendID)
      throw new HttpException('Username Invalid', HttpStatus.BAD_REQUEST);
    return this.userService.unfriend(req.user.id, body.friendID);
  }

  //////// CHANNEL MANAGEMENT ////////

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/createChannel')
  async createChannel(@Req() req: any, @Body() body: CreateChannelDto) {
    if (!body || !req.user.id)
      throw new HttpException('No Channel Name or Username', 400);
    return this.channelService.createChannel(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/joinChannel')
  async joinChannel(@Req() req, @Body() payload: JoinChannelDto) {
    if (!payload || !payload.channelID)
      throw new BadRequestException('Missing Channel ID');
    return this.channelService.joinChannel(
      req.user.id,
      payload.channelID,
      payload.password,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/channelMembers/:channelID')
  async channelMembers(@Req() req: any, @Param('channelID', ParseIntPipe) channelID: number) {
	if (!channelID) throw new NotFoundException('Channel ID not provided');
	return this.channelService.channelMembers(req.user.id, channelID);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/leaveChannel')
  async leaveChannel(@Req() req: any, @Body() body: LeaveChannelDto) {
	return this.channelService.leaveChannel(req.user.id, body.channelID)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/removeChannel/:channelID')
  async removeChannel(@Req() req: any, @Param('channelID', ParseIntPipe) channelID: number) {
	if (!channelID) throw new BadRequestException("Channel ID not valid");
	return this.channelService.removeChannel(req.user.id, channelID);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/muteUser')
  async muteUser(@Req() req: any, @Body() body: UserMuteDto) {
	if (!body || !body.channelID) throw new BadRequestException("Channel ID not valid");
	if (!body || !body.userID) throw new BadRequestException("User ID not valid");
	return this.channelService.muteUser(req.user.id, body.userID, body.channelID);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/makeAdmin')
  async makeAdmin(@Req() req: any, @Body() body: MakeAdminDto) {
    if (!body || !body.channelID) throw new BadRequestException("Channel ID not valid");
    if (!body || !body.userID) throw new BadRequestException("User ID not valid");

    return this.channelService.makeAdmin(req.user.id, body.userID, body.channelID);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/addChannelMember')
  async addChannelMember(@Req() req: any, @Body() body: addChannelMemberDto) {
    if (!body || !body.channelID) throw new BadRequestException("Channel ID not valid");
    if (!body || !body.username) throw new BadRequestException("Username not valid");

    return this.channelService.addChannelMember(req.user.id, body.username, body.channelID);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/isFlagged/:channelID')
  async isFlagged(@Req() req: any, @Param('channelID', ParseIntPipe) channelID: number) {
	if (!channelID) throw new NotFoundException("Channel ID not valid");
	return this.channelService.isFlagged(req.user.id, channelID);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/banUser')
  async banUser(@Req() req: any, @Body() body: BanUserDto) {
	if (body.channelID && body.userID)
		return this.channelService.banUser(req.user.id, body.userID, body.channelID);
	else
		throw new BadRequestException("Channel ID or User ID not valid");
  }

  @UseGuards(JwtAuthGuard)
  @Post('/unbanUser')
  async unbanUser(@Req() req: any, @Body() body: UnBanUserDto) {
	if (body.channelID && body.userID)
		return this.channelService.unbanUser(req.user.id, body.userID, body.channelID);
	else
		throw new BadRequestException("Channel ID or User ID not valid");
  }

  @UseGuards(JwtAuthGuard)
  @Post('/kickUser')
  async kickUser(@Req() req: any, @Body() body: KickUserDto) {
	if (body.channelID && body.userID)
		return this.channelService.kickUser(req.user.id, body.userID, body.channelID);
	else
		throw new BadRequestException("Channel ID or User ID not valid");
  }

  @UseGuards(JwtAuthGuard)
  @Post('/channelPassword')
  async updatePassword(@Req() req: any, @Body() body: UpdatePasswordDto) {
    if (!body || !body.channelId) throw new NotFoundException("Channels ID not valid");
    return await this.channelService.updatePassword(req.user.id, body.channelId, body.newPassword)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/isBanned/:memberId/:channelId')
  async isBanned( @Param('memberId', ParseIntPipe) memberId: number, @Param('channelId', ParseIntPipe) channelId: number) {
	if (!memberId || !channelId) throw new BadRequestException("Member ID or Channel ID not valid");
	const res = await this.channelService.isBanned(memberId, channelId);
	return res;
  }
}
