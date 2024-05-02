import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../grouping.test-samples';

import { GroupingFormService } from './grouping-form.service';

describe('Grouping Form Service', () => {
  let service: GroupingFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupingFormService);
  });

  describe('Service methods', () => {
    describe('createGroupingFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGroupingFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            iD: expect.any(Object),
            groupingName: expect.any(Object),
            groupingPoints: expect.any(Object),
            remainingTime: expect.any(Object),
            currentDate: expect.any(Object),
          })
        );
      });

      it('passing IGrouping should create a new form with FormGroup', () => {
        const formGroup = service.createGroupingFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            iD: expect.any(Object),
            groupingName: expect.any(Object),
            groupingPoints: expect.any(Object),
            remainingTime: expect.any(Object),
            currentDate: expect.any(Object),
          })
        );
      });
    });

    describe('getGrouping', () => {
      it('should return NewGrouping for default Grouping initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createGroupingFormGroup(sampleWithNewData);

        const grouping = service.getGrouping(formGroup) as any;

        expect(grouping).toMatchObject(sampleWithNewData);
      });

      it('should return NewGrouping for empty Grouping initial value', () => {
        const formGroup = service.createGroupingFormGroup();

        const grouping = service.getGrouping(formGroup) as any;

        expect(grouping).toMatchObject({});
      });

      it('should return IGrouping', () => {
        const formGroup = service.createGroupingFormGroup(sampleWithRequiredData);

        const grouping = service.getGrouping(formGroup) as any;

        expect(grouping).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGrouping should not enable id FormControl', () => {
        const formGroup = service.createGroupingFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGrouping should disable id FormControl', () => {
        const formGroup = service.createGroupingFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
