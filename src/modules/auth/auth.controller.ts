import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { SingInDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public() // Should bypass JWT and role checks
  @ApiOperation({
    summary: 'Login to the system',
  })
  @ApiResponse({
    status: 201,
    description: 'Login successful',
    example: {
      success: true,
      message: 'Success',
      status: 201,
      data: {
        accessToken: 'token',
      },
      Result: 'Success',
    },
  })
  async login(@Body() body: SingInDto) {
    return this.authService.login(body.username, body.password);
  }

  @Get('user')
  @ApiBearerAuth() // Indicates JWT is required
  @ApiOperation({ summary: 'Get authenticated user info' })
  @ApiResponse({
    status: 200,
    description: 'Authenticated user information',
    example: {
      success: true,
      message: 'Success',
      status: 200,
      data: {
        Id: 'b5235663-8792-43da-905b-089f84a3b11e',
        Email: 'admin@admin.com',
        Roles: ['ADMIN'],
        Permissions: ['Read:Users', 'Write:Users'],
        Properties: [
          {
            Id: '72a144cc-3dcd-4a7e-aa07-e31a47b3f3b5',
            Name: 'Hotel Jazz',
          },
        ],
        ActiveProperty: {
          Id: '72a144cc-3dcd-4a7e-aa07-e31a47b3f3b5',
          Name: 'Hotel Jazz',
        },
      },
      Result: 'Success',
    },
  })
  async authUser(@Request() req: any) {
    return req.user;
  }
}
