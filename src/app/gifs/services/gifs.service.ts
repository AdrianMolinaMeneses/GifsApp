import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

//const GIPHY_API_KEY = 'RzRvKpK8X1qY81BbEfmF1y49yXLqAnDT';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  public gifList: Gif[] = [];
  private _tagsHistory: string[] = [];
  private apikey: string = 'RzRvKpK8X1qY81BbEfmF1y49yXLqAnDT';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  searchTag(tag: string): void {
    if (tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apikey)
      .set('limit', '10')
      .set('q', tag);

    this.http
      .get<SearchResponse>(`${this.serviceUrl}/search`, { params: params })
      .subscribe((resp) => {
        this.gifList = resp.data.length ? resp.data : [];
        //console.log({ gifs: this.gifList });
      });
  }

  private organizeHistory(tag: string): void {
    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter(
        (oldTag) => oldTag !== tag.toLowerCase()
      );
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    if (!localStorage.getItem('history')) return;

    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

    if (this._tagsHistory.length === 0) return;

    this.searchTag(this._tagsHistory[0]);
  }
}
