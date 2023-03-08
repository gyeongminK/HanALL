import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/entities/User.entity';
import { AccessCheck } from '../auth/decorators/userAuth.decorator';
import { AccessTokenGuard } from '../auth/guards/accesstoken.guard';
import { ScrapsService } from './scraps.service';

@ApiTags('Scrap')
@Controller('scraps')
export class ScrapsController {
  constructor(private scrapsService: ScrapsService) {}

  @Post('/:postId')
  @ApiOperation({ summary: '보관하기' })
  @ApiSecurity('accesstokenAuth')
  @ApiResponse({ status: 200, type: Boolean })
  @ApiResponse({ status: 503, description: '보관하기 실패' })
  @UseGuards(AccessTokenGuard)
  async createScrap(
    @AccessCheck() user: User,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return await this.scrapsService.createScrap(user, postId);
  }
}
