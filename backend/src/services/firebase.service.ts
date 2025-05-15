import * as admin from "firebase-admin";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FirebaseService {
    constructor() {
        if (admin.apps.length === 0) {
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
            });
        }
    }

    // envia a notificacao push, precisa testar na pratica no front
    async sendPushNotification(token: string, payload: any) {
        try {
            await admin.messaging().send({
                token,
                notification: {
                    title: payload.title,
                    body: payload.body,
                },
                data: payload.data || {},
            });
        } catch (error) {
            console.error("Erro ao enviar notificação:", error);
        }
    }
}
