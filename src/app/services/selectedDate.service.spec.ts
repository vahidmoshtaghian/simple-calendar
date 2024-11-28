import { TestBed } from '@angular/core/testing';
import { SelectedDateService } from './selectedDate.service';

describe('SelectedDateService', () => {
  let service: SelectedDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectedDateService],
    });
    service = TestBed.inject(SelectedDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially emit null as the current date', (done) => {
    service.currentDate.subscribe((date) => {
      expect(date).toBeNull();
      done();
    });
  });

  it('should emit the new date when changeDate is called', (done) => {
    const newDate = new Date(2024, 10, 28); // Example date
    service.changeDate(newDate);

    service.currentDate.subscribe((date) => {
      expect(date).toEqual(newDate);
      done();
    });
  });

  it('should emit multiple dates in sequence', (done) => {
    const dates = [
      new Date(2024, 0, 1),
      new Date(2024, 1, 14),
      new Date(2024, 2, 25),
    ];

    let index = 0;

    service.currentDate.subscribe((date) => {
      if (index < dates.length) {
        expect(date).toEqual(dates[index]);
        index++;
      }
      if (index === dates.length) {
        done();
      }
    });

    // Emit each date in sequence
    dates.forEach((date) => service.changeDate(date));
  });
});
