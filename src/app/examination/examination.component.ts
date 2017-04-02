import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { ApiService } from '../shared';
import * as _ from 'lodash';
import { Subject, Examination, MATERIAL_COLORS_DATA, EXAMINATION_COLOR } from '../models';

@Component({
  selector: 'my-examination',
  templateUrl: './examination.component.html',
  styleUrls: ['./examination.component.scss']
})
export class ExaminationComponent implements OnInit {
  private subject: Observable<any>;
  private examination: Observable<any>;
  private subjectID: string;
  private examinationID: string;
  private problems: Observable<any>;

  constructor(private route: ActivatedRoute, private api: ApiService, private af: AngularFire, private modalService: NgbModal) {
    this.subject = route.params.switchMap((params: Params) => af.database.object(`/subjects/${params['sid']}`));
    this.examination = route.params.switchMap((params: Params) => af.database.object(`/examinations/${params['sid']}/${params['eid']}`));
    this.problems = route.params.switchMap((params: Params) => af.database.list(`/problems/${params['eid']}`));
  }

  ngOnInit() {
    this.subject.subscribe(s => {
      this.examination.subscribe(e => {
        this.api.NavbarTitle$.next(`Goalize>${s.name}>${e.name}`);
        this.examinationID = e.$key;
      });
      this.api.NavbarColor$.next(s.color);
      this.subjectID = s.$key;
    });
  }
}