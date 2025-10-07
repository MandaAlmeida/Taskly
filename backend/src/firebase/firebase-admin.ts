import * as admin from 'firebase-admin';
import * as serviceAccount from '../../firebase-service-account.json';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
});

export default admin;
