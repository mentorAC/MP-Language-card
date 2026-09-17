import { Component, inject, OnInit, signal } from '@angular/core';
import { ThemaService } from '../../../services/thema.service';
import { ThemaModel } from '../../../Models/thema.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-select-themas-modal',
  imports: [],
  templateUrl: './select-themas-modal.html',
  styleUrl: './select-themas-modal.css',
})
export class SelectThemasModal implements OnInit {
  themaService = inject(ThemaService);
  themas = signal<ThemaModel[]>([]);
  selectedThemas : ThemaModel[] =[];
  modal = inject(NgbActiveModal);
  isChecked = true;
  ngOnInit(): void {
    this.themaService.getAll().subscribe(themas =>{
      this.themas.set(themas);
    });
    console.log(this.selectedThemas);
  }
  toggleThema(selectedThema: ThemaModel, event: Event) {
  const checkbox = event.target as HTMLInputElement;
  if (checkbox.checked) {
    if (!this.selectedThemas.some(t => t.id === selectedThema.id)) {
      this.selectedThemas.push(selectedThema);
    }
  } else {
    this.selectedThemas = this.selectedThemas.filter(
      t => t.id !== selectedThema.id
    );
  }
}
 saveCloseBtn(){
  this.modal.close(this.selectedThemas);
 }
 isThemaSelected(thema: ThemaModel): boolean {
  return this.selectedThemas.some(t => t.id === thema.id);
}

}
