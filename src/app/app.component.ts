import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    numTasks: number;
    numResources: number;

    constructor(private route: ActivatedRoute) {
        this.numTasks = this.route.snapshot.params['tasks'] || 520;
        this.numResources = this.route.snapshot.params['resources'] || 80;
    }
}
