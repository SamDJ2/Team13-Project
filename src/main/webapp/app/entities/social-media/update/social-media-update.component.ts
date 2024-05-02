import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { SocialMediaFormService, SocialMediaFormGroup } from './social-media-form.service';
import { ISocialMedia } from '../social-media.model';
import { SocialMediaService } from '../service/social-media.service';

@Component({
  selector: 'jhi-social-media-update',
  templateUrl: './social-media-update.component.html',
})
export class SocialMediaUpdateComponent implements OnInit {
  isSaving = false;
  socialMedia: ISocialMedia | null = null;

  editForm: SocialMediaFormGroup = this.socialMediaFormService.createSocialMediaFormGroup();

  constructor(
    protected socialMediaService: SocialMediaService,
    protected socialMediaFormService: SocialMediaFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ socialMedia }) => {
      this.socialMedia = socialMedia;
      if (socialMedia) {
        this.updateForm(socialMedia);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const socialMedia = this.socialMediaFormService.getSocialMedia(this.editForm);
    if (socialMedia.id !== null) {
      this.subscribeToSaveResponse(this.socialMediaService.update(socialMedia));
    } else {
      this.subscribeToSaveResponse(this.socialMediaService.create(socialMedia));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISocialMedia>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(socialMedia: ISocialMedia): void {
    this.socialMedia = socialMedia;
    this.socialMediaFormService.resetForm(this.editForm, socialMedia);
  }
}
