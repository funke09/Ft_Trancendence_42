import { Card, List, ListItem, ListItemPrefix, Tooltip, Typography } from "@material-tailwind/react";
import Image from "next/image";
import Loading from "../Layout/Loading";

function Achievements({ stats } : { stats: any }) {
  const hasAchievements = stats?.stats?.achievements?.length > 0;

  if (!stats) {
    return <Loading />;
  }

  return (
    <Card className="container rounded-[15px] bg-[#472C45] h-[320px] mt-2 overflow-y-auto">
      {hasAchievements ? (
        <List>
          {stats?.stats?.achievements?.map((achiev: any) => (
            <Tooltip key={achiev.id} className="bg-gray-700 bg-opacity-80" content={achiev.desc} placement="top" animate={{mount: { scale: 1, x: 0 }, unmount: { scale: 0, x: -25 },}}>
              <ListItem className="p-1 text-white hover:text-[#472C45]">
                <ListItemPrefix>
                  <Image src={achiev.icon} width={50} height={50} alt={achiev.name} className="rounded-full"/>
                </ListItemPrefix>
                <Typography variant="h6">{achiev.name}</Typography>
              </ListItem>
            </Tooltip>
          ))}
        </List>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Typography variant="h3" className="text-gray-500 opacity-50">
            No Content
          </Typography>
        </div>
      )}
    </Card>
  );
}

export default Achievements;