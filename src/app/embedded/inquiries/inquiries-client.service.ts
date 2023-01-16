import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";


export interface Inquiry {
  id: string;
  label: string;
  receivedAt: string;
  archivedAt?: string;
  error?: string;
  description: string;
  contactId: string;
  templateId: string;
  lastExecutedAt?: string;
}

export interface TeilerRequestResponse {
  responseUrl: string;
}

export interface UrlAndParameters {
  url: string;
  parameters: HttpParams | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class InquiriesClientService {

  backendUrl: string | undefined;

  httpHeaders: HttpHeaders = new HttpHeaders().append("x-api-key", environment.config.TEILER_API_KEY);

  constructor(private httpClient: HttpClient) {
  }

  fetchArchivedInquiries(backendUrl: string | undefined): Observable<Inquiry[]> {
    this.backendUrl = backendUrl;
    return this.httpClient.get<Inquiry[]>(backendUrl + "/archived-inquiries", {headers: this.httpHeaders});
  }

  fetchActiveInquiries(backendUrl: string | undefined): Observable<Inquiry[]> {
    this.backendUrl = backendUrl;
    return this.httpClient.get<Inquiry[]>(backendUrl + "/active-inquiries", {headers: this.httpHeaders});
  }

  fetchFailedInquiries(backendUrl: string | undefined): Observable<Inquiry[]> {
    this.backendUrl = backendUrl;
    return this.httpClient.get<Inquiry[]>(backendUrl + "/error-inquiries", {headers: this.httpHeaders});
  }

  fetchInquiry(queryId: string): Observable<Inquiry> | undefined {
    return (this.backendUrl) ? this.httpClient.get<Inquiry>(this.backendUrl + "/inquiry", {
      params: new HttpParams().append("query-id", queryId),
      headers: this.httpHeaders
    }) : undefined;
  }


  postRequest(queryId: string, templateId: string, outputFormat: string): Observable<TeilerRequestResponse> | undefined {
    return (this.backendUrl) ? this.httpClient.post<TeilerRequestResponse>(this.backendUrl + "/request", null, {
      headers: this.httpHeaders,
      params: new HttpParams()
        .append("query-id", queryId)
        .append("template-id", templateId)
        .append("output-format", outputFormat)
    }) : undefined;
  }

  createExport(responseUrl: string | undefined) {
    if (responseUrl) {
      let urlAndParameters = this.extractUrlAndParameters(responseUrl);
      this.httpClient.get(urlAndParameters.url, {
        //headers: this.httpHeaders,
        params: urlAndParameters.parameters,
        responseType: 'blob',
        observe: 'response'
      }).subscribe(response => {
        if (response.status == 200) {
          let filename = this.extractFilename(response);
          if (!filename) {
            filename = "export";
          }
          let link = document.createElement('a');
          // @ts-ignore
          link.href = URL.createObjectURL(response.body);
          link.download = filename;
          link.click();
        } else if (response.status == 202) {

        } else {
          //TODO
        }
      });
    }
  }

  extractFilename(response: HttpResponse<Blob>): string | undefined {
    let contentDisposition = response.headers.get("Content-Disposition");
    if (contentDisposition) {
      let index = contentDisposition.indexOf("=");
      if (index >= 0) {
        return contentDisposition.substring(index + 1);
      }
    }
    return undefined;
  }

  extractUrlAndParameters(responseUrl: string): UrlAndParameters {
    let index = responseUrl.indexOf("?");
    return (index == -1) ? {url: responseUrl, parameters: undefined} : {
      url: responseUrl,
      parameters: this.extractParams(responseUrl.substring(index + 1))
    };
  }


  extractParams(flatParameters: string): HttpParams {
    var results = new HttpParams();
    flatParameters.split("&").forEach(value => {
      let parameter = value.split("=");
      results.append(parameter[0], parameter[1]);
    });
    return results;
  }


}
