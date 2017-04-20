import { getRoles } from './role';
import * as faker from 'faker';

export class Resource {
  name: string;
  role: string;
  index: number;

  constructor(index: number) {
    let roles = getRoles();
    this.name = faker.name.findName();
    this.role = roles[Math.floor( Math.random() * roles.length)];
    this.index = index;
  }
}
