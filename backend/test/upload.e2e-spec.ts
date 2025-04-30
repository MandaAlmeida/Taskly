import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { EnvService } from '../src/env/env.service';
import { UploadModule } from '../src/modules/upload.module';
import { ConfigService } from '@nestjs/config';

describe('UploadController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UploadModule],
            providers: [EnvService, ConfigService],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    let uploadedFileName: string;

    it('Deve fazer upload de um arquivo', async () => {
        const res = await request(app.getHttpServer())
            .post('/uploads')
            .attach('file', Buffer.from('Teste de upload'), {
                filename: 'teste.pdf',
                contentType: 'application/pdf',
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('url');

        // Armazene o nome completo gerado para usar nos próximos testes
        uploadedFileName = res.body.url;  // O nome completo com UUID
    });

    it('Deve gerar a URL pública do arquivo', async () => {
        const res = await request(app.getHttpServer()).get(`/uploads/${uploadedFileName}`);

        expect(res.status).toBe(200);

        // Verifica se o campo 'url' existe e começa com o valor da env
        const expectedPrefix = process.env.URL_PUBLIC_GET_IMAGE || 'https://';
        expect(res.body).toHaveProperty('url');
        expect(res.body.url).toMatch(new RegExp(`^${expectedPrefix}`));
        expect(res.body.url).toContain(uploadedFileName); // Verifica se inclui o nome do arquivo
    });


    it('Deve fazer download do arquivo', async () => {
        const res = await request(app.getHttpServer()).get(`/uploads/download/${uploadedFileName}`);

        expect(res.status).toBe(200);

        // Verifica se o content-type está presente e válido
        expect(res.header['content-type']).toBeDefined();
        expect(res.header['content-type']).toMatch(/application\/pdf|octet-stream|binary/);

        // Verifica que o corpo contém dados
        expect(res.body).toBeDefined();
        expect(res.body.length).toBeGreaterThan(0); // assumindo que o conteúdo é um buffer
    });


    // it('Deve deletar o arquivo', async () => {
    //     // Use o nome completo do arquivo para deletar
    //     const res = await request(app.getHttpServer()).delete(`/uploads/${uploadedFileName}`);

    //     expect(res.status).toBe(200);
    //     expect(res.body.success).toBe(true);
    // });

});
