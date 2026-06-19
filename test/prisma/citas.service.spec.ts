import { Test, TestingModule } from '@nestjs/testing';
import { CitasService } from '../../src/controllers/citas/citas.service';

describe('CitasService', () => {
  let service: CitasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CitasService],
    }).compile();

    service = module.get<CitasService>(CitasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
