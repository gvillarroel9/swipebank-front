import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from '../../../services/accounts/accounts.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account-withdraw',
  templateUrl: './account-withdraw.component.html',
  styleUrls: ['./account-withdraw.component.css'],
})
export class AccountWithdrawComponent implements OnInit {
  withdrawForm: FormGroup;
  accounts: any = [];
  accountsReady = false;
  accountSelected = false;
  doingWithdraw = false;
  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountsService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getAccounts();
  }

  getAccounts() {
    this.accountService.getAccounts().subscribe((res) => {
      this.accounts = res;
      console.log('seeting', res);

      this.accountsReady = true;
    });
  }

  createForm() {
    this.withdrawForm = this.formBuilder.group({
      accountNumber: ['', Validators.required],
      amount: ['', Validators.required],
      balance: [''],
    });

    this.withdrawForm.controls.accountNumber.valueChanges.subscribe((value) => {
      this.accountSelected = true;
      if (value) {
        const account = this.accounts.find(
          (element) => element.number === value
        );
        this.withdrawForm.controls.amount.setValidators([
          Validators.max(account.balance),
          Validators.min(0.01),
          Validators.required,
        ]);
        this.withdrawForm.updateValueAndValidity();
      }
    });
  }

  setFormValue(attr: string, value: string) {
    this.withdrawForm.controls[attr].setValue(value);
  }

  withdraw() {
    console.log(this.withdrawForm.value);
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Realizar un depósito por un monto de ${this.withdrawForm.value.amount}
              a la cuenta ${this.withdrawForm.value.accountNumber} `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      cancelButtonColor: 'Red',
    }).then((result) => {
      if (result.value) {
        this.doingWithdraw = true;
        this.accountService.withdraw(this.withdrawForm.value).subscribe(
          (res) => {
            this.showMessage('El retiro se ha realizado con exito', 'success');
            this.getAccounts();
            this.withdrawForm.reset();
          },
          (error) => this.showMessage('Hubo un error al retirar', 'error'),
          () => {
            this.doingWithdraw = false;
          }
        );
      }
    });
  }

  showMessage(message, type) {
    Swal.fire('', message, type);
  }
}
