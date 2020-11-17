import { Component, OnInit } from '@angular/core';
import { CreditCardService } from '../../../services/credit-card/credit-card.service';

@Component({
  selector: 'app-credit-card-list',
  templateUrl: './credit-card-list.component.html',
  styleUrls: ['./credit-card-list.component.css']
})
export class CreditCardListComponent {

  public creditCards = [];
  constructor(private _creditCardService: CreditCardService) { 
    this._creditCardService.getCreditCards().subscribe(res => {
      this.creditCards = res;
    });
  }

  ngOnInit(): void {
  }

}