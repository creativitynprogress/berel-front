import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { Card } from '../_models/card';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: './cards.component.html'
})

export class CardsComponent implements OnInit {
  public cards: Card[] = []
  public open_form: boolean = false;

  public cardForm: FormGroup;
  public terminal: FormControl;
  public type: FormControl;
  public commision: FormControl;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.userService.card_list().subscribe(
      cards => this.cards = cards
    )

    this.terminal = this.fb.control('', Validators.required)
    this.type = this.fb.control('', Validators.required)
    this.commision = this.fb.control('', Validators.required)

    this.cardForm = this.fb.group({
      terminal: this.terminal,
      type: this.type,
      commision: this.commision
    })
  }


  openModal() {
    this.open_form = true;
  }

  saveCard() {
    this.userService.card_create(this.cardForm.value).subscribe(
      card => {
        this.cards.push(card)
        this.open_form = false;
        this.cardForm.reset();
      }
    )
  }

  deleteCard(card) {
    this.userService.card_delete(card._id).subscribe(
      response => {
        this.cards = this.cards.filter(c => c._id !== card._id)
      }
    )
  }
}
