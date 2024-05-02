import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IHistory, NewHistory } from '../history.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IHistory for edit and NewHistoryFormGroupInput for create.
 */
type HistoryFormGroupInput = IHistory | PartialWithRequiredKeyOf<NewHistory>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IHistory | NewHistory> = Omit<T, 'dateStarted'> & {
  dateStarted?: string | null;
};

type HistoryFormRawValue = FormValueOf<IHistory>;

type NewHistoryFormRawValue = FormValueOf<NewHistory>;

type HistoryFormDefaults = Pick<NewHistory, 'id' | 'dateStarted'>;

type HistoryFormGroupContent = {
  id: FormControl<HistoryFormRawValue['id'] | NewHistory['id']>;
  challengeName: FormControl<HistoryFormRawValue['challengeName']>;
  challengeLevel: FormControl<HistoryFormRawValue['challengeLevel']>;
  dateStarted: FormControl<HistoryFormRawValue['dateStarted']>;
  username: FormControl<HistoryFormRawValue['username']>;
};

export type HistoryFormGroup = FormGroup<HistoryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class HistoryFormService {
  createHistoryFormGroup(history: HistoryFormGroupInput = { id: null }): HistoryFormGroup {
    const historyRawValue = this.convertHistoryToHistoryRawValue({
      ...this.getFormDefaults(),
      ...history,
    });
    return new FormGroup<HistoryFormGroupContent>({
      id: new FormControl(
        { value: historyRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      challengeName: new FormControl(historyRawValue.challengeName),
      challengeLevel: new FormControl(historyRawValue.challengeLevel),
      dateStarted: new FormControl(historyRawValue.dateStarted),
      username: new FormControl(historyRawValue.username),
    });
  }

  getHistory(form: HistoryFormGroup): IHistory | NewHistory {
    return this.convertHistoryRawValueToHistory(form.getRawValue() as HistoryFormRawValue | NewHistoryFormRawValue);
  }

  resetForm(form: HistoryFormGroup, history: HistoryFormGroupInput): void {
    const historyRawValue = this.convertHistoryToHistoryRawValue({ ...this.getFormDefaults(), ...history });
    form.reset(
      {
        ...historyRawValue,
        id: { value: historyRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): HistoryFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateStarted: currentTime,
    };
  }

  private convertHistoryRawValueToHistory(rawHistory: HistoryFormRawValue | NewHistoryFormRawValue): IHistory | NewHistory {
    return {
      ...rawHistory,
      dateStarted: dayjs(rawHistory.dateStarted, DATE_TIME_FORMAT),
    };
  }

  private convertHistoryToHistoryRawValue(
    history: IHistory | (Partial<NewHistory> & HistoryFormDefaults)
  ): HistoryFormRawValue | PartialWithRequiredKeyOf<NewHistoryFormRawValue> {
    return {
      ...history,
      dateStarted: history.dateStarted ? history.dateStarted.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
