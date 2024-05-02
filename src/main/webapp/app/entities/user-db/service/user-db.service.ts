import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserDB, NewUserDB } from '../user-db.model';

export type PartialUpdateUserDB = Partial<IUserDB> & Pick<IUserDB, 'id'>;

export type EntityResponseType = HttpResponse<IUserDB>;
export type EntityArrayResponseType = HttpResponse<IUserDB[]>;

@Injectable({ providedIn: 'root' })
export class UserDBService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-dbs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userDB: NewUserDB): Observable<EntityResponseType> {
    return this.http.post<IUserDB>(this.resourceUrl, userDB, { observe: 'response' });
  }

  update(userDB: IUserDB): Observable<EntityResponseType> {
    return this.http.put<IUserDB>(`${this.resourceUrl}/${this.getUserDBIdentifier(userDB)}`, userDB, { observe: 'response' });
  }

  partialUpdate(userDB: PartialUpdateUserDB): Observable<EntityResponseType> {
    return this.http.patch<IUserDB>(`${this.resourceUrl}/${this.getUserDBIdentifier(userDB)}`, userDB, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserDB>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserDB[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserDBIdentifier(userDB: Pick<IUserDB, 'id'>): number {
    return userDB.id;
  }

  compareUserDB(o1: Pick<IUserDB, 'id'> | null, o2: Pick<IUserDB, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserDBIdentifier(o1) === this.getUserDBIdentifier(o2) : o1 === o2;
  }

  addUserDBToCollectionIfMissing<Type extends Pick<IUserDB, 'id'>>(
    userDBCollection: Type[],
    ...userDBSToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userDBS: Type[] = userDBSToCheck.filter(isPresent);
    if (userDBS.length > 0) {
      const userDBCollectionIdentifiers = userDBCollection.map(userDBItem => this.getUserDBIdentifier(userDBItem)!);
      const userDBSToAdd = userDBS.filter(userDBItem => {
        const userDBIdentifier = this.getUserDBIdentifier(userDBItem);
        if (userDBCollectionIdentifiers.includes(userDBIdentifier)) {
          return false;
        }
        userDBCollectionIdentifiers.push(userDBIdentifier);
        return true;
      });
      return [...userDBSToAdd, ...userDBCollection];
    }
    return userDBCollection;
  }
}
