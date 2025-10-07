import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function initSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle("Api TaskLy")
        .setDescription("Documentacao da api TaskLy")
        .setVersion("1.0")
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup("api", app, document)
}