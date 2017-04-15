import { getRoles } from './role';
import * as faker from 'faker';

export class Resource {
  name: string;
  role: string;

  constructor() {
    let roles = getRoles();
    this.name = faker.name.findName();
    this.role = roles[Math.floor( Math.random() * roles.length)];
  }
}
