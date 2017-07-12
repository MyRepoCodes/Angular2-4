import { Component} from '@angular/core';

@Component({
  selector: 'sn-commentsdfer',
  templateUrl: 'comments.component.html'
})

export class CommentsInfoComponent {
  filter = {
    linkType: '',
    linkRef: ''
  };
}



