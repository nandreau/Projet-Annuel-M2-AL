import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { PrimengModule } from 'src/app/shared/primeng.module';

@Component({
  selector: 'app-image-manager',
  standalone: true,
  imports: [CommonModule, PrimengModule],
  templateUrl: './image-manager.component.html',
  styleUrls: ['./image-manager.component.scss'],
})
export class ImageManagerComponent {
  @Input() images: string[] = [];
  @Output() imagesChange = new EventEmitter<string[]>();

  remove(idx: number) {
    this.images.splice(idx, 1);
    this.imagesChange.emit(this.images);
  }

  upload(event: { files: File[] }, fileUpload: FileUpload) {
    for (const file of event.files) {
      const reader = new FileReader();
      reader.onload = () => {
        this.images.push(reader.result as string);
        this.imagesChange.emit(this.images);
      };
      reader.readAsDataURL(file);
    }
    fileUpload.clear();
  }
}
