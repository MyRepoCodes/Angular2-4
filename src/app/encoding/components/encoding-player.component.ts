import { Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy, ElementRef, Renderer } from '@angular/core';
import { StbDevice } from '../encoding.entity';

@Component({
  selector: 'sn-encoding-player',
  templateUrl: './encoding-player.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EncodingPlayerComponent implements OnInit, OnDestroy {

  public message = '';
  height;
  private vlc: any;

  constructor(private elementRef: ElementRef, private renderer: Renderer) {

  }

  @Input()
  public set selectedStb(value: StbDevice) {
    if (value && this.checkPlayer()) {
      this.vlc.playlist.clear();
      this.vlc.playlist.add(value.streamUri);
      this.vlc.playlist.play();
    }
  }

  @Input()
  public set volume(value: number) {
    if (value && this.checkPlayer()) {
      this.vlc.audio.volume = value;
    }
  }

  @Input()
  public set isMuted(value: boolean) {
    if (this.checkPlayer()) {
      this.vlc.audio.mute = value;
    }
  }

  private checkPlayer(): boolean {
    if (!this.vlc || !this.vlc.playlist || !this.vlc.audio) {
      this.message = 'Please allow plugin to use it';
      return false;
    } else {
      this.message = '';
      return true;
    }
  }

  ngOnInit() {
    this.vlc = document.getElementById('vlc');

    const handler = (e) => {
      if (this.vlc) {
        this.vlc.height = this.vlc.offsetWidth * 9 / 16;
      }
    };

    this.renderer.listenGlobal('window', 'resize', handler);
    setTimeout(() => {
      handler(null);
    }, 100);
  }

  ngOnDestroy() {
    if (this.vlc && this.vlc.playlist) {
      this.vlc.playlist.clear();
    }
  }
}

