import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
    Inject,
    forwardRef,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AnnotationService } from '../services/annotation.service';
import { ROLES_KEY } from '@/decorator/roles.decorator';
import { GroupService } from '@/services/group.service';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        @Inject(forwardRef(() => AnnotationService))
        private readonly annotationService: AnnotationService,
        private readonly groupService: GroupService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) return true;

        const request = context.switchToHttp().getRequest();
        const { user, params } = request;
        const { annotationId, groupId } = params;

        const hasAnnotationPermission = annotationId
            ? await this.checkAnnotationPermission(annotationId, user.sub, requiredRoles)
            : false;

        const hasGroupPermission = groupId
            ? await this.checkGroupPermission(groupId, user.sub, requiredRoles)
            : false;


        if (annotationId && groupId && hasAnnotationPermission && hasGroupPermission) {
            return true;
        }
        if (annotationId && hasAnnotationPermission && groupId === undefined) {
            return true;
        }
        if (groupId && hasGroupPermission) {
            return true;
        }

        throw new ForbiddenException('Você não tem permissão para acessar essa rota');
    }

    private async checkAnnotationPermission(annotationId: string, userId: string, requiredRoles: string[]) {
        const annotation = await this.annotationService.fetchById(annotationId);
        if (!annotation) throw new ForbiddenException('Anotação não encontrada');

        const isOwner = annotation.createdUserId.toString() === userId;
        const member = annotation.members.find(m => m.userId.toString() === userId);

        return isOwner || (member && requiredRoles.includes(member.accessType));
    }

    private async checkGroupPermission(groupId: string, userId: string, requiredRoles: string[]) {
        const group = await this.groupService.fetchById(groupId);
        if (!group) throw new ForbiddenException('Grupo não encontrado');

        const isOwner = group.createdUserId.toString() === userId;
        const member = group.members.find(m => m.userId.toString() === userId);

        return isOwner || (member && requiredRoles.includes(member.accessType));
    }
}
