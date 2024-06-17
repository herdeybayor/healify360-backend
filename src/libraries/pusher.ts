import Pusher from "pusher";
import { CONFIGS } from "@/configs";

const pusherClient = new Pusher({
    useTLS: true,
    key: CONFIGS.PUSHER.APP_KEY,
    appId: CONFIGS.PUSHER.APP_ID,
    secret: CONFIGS.PUSHER.APP_SECRET,
    cluster: CONFIGS.PUSHER.APP_CLUSTER,
});

export const authorizeChannel = (socketId: string, channel: string, userData: any) => {
    const auth = pusherClient.authorizeChannel(socketId, channel, userData);
    return auth;
};

export const authenticateUser = (socketId: string, userData: any) => {
    const userAuth = pusherClient.authenticateUser(socketId, userData);
    return userAuth;
};

export const trigger = async (channel: string | string[], event: string, data: any, params = {}) => {
    const result = await pusherClient.trigger(channel, event, data, params);
    return result;
};
