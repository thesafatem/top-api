import {
	Controller,
	HttpCode,
	Post,
	UseInterceptors,
} from '@nestjs/common';
import { UploadedFile, UseGuards } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FileElementResponse } from './dto/file-element.response';
import { FilesService } from './files.service';
import { MFile } from './mfile.class';
@Controller()
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Post('upload')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('files'))
	async uploadFile(
		@UploadedFile() file: Express.Multer.File,
	): Promise<FileElementResponse[]> {
		const saveArray: MFile[] = [file];
		if (file.mimetype.includes('image')) {
			const buffer = await this.filesService.convertToWebP(
				file.buffer,
			);
			saveArray.push(
				new MFile({
					originalname: `${file.originalname.split('.')[0]}.webp`,
					buffer,
				}),
			);
		}

		return this.filesService.saveFiles(saveArray);
	}
}
