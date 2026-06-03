import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { OrdersService, CreateOrderItemDto } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: "Get the current user's orders" })
  findAll(@Request() req: { user: { userId: number } }) {
    return this.ordersService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific order by ID' })
  @ApiParam({ name: 'id', type: Number })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { userId: number } },
  ) {
    return this.ordersService.findOne(id, req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({
    schema: {
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              foodId: { type: 'number' },
              quantity: { type: 'number' },
            },
            required: ['foodId', 'quantity'],
          },
        },
      },
      required: ['items'],
    },
  })
  create(
    @Body('items') items: CreateOrderItemDto[],
    @Request() req: { user: { userId: number } },
  ) {
    return this.ordersService.create(req.user.userId, items);
  }
}
