import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboardStats(@Query('providerId') providerId: string) {
    return this.analyticsService.getDashboardStats(providerId);
  }

  @Get('monthly-trend')
  getMonthlyTrend(
    @Query('providerId') providerId: string,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    return this.analyticsService.getMonthlyTrend(
      providerId,
      parseInt(year),
      parseInt(month),
    );
  }
}
