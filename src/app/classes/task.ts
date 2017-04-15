export class Task {
  startDay: number;
  hours: number;

  constructor() {
    // random day of the month when task is started
    this.startDay = Math.floor(Math.random() * 30) || 1;

    // some random number of hours from 1 to 80
    this.hours = Math.floor(Math.random() * 80) || 1;
  }
}
