import { Injectable } from '@angular/core';
import Image from 'image-js';

@Injectable({
  providedIn: 'root'
})
export class ImageProcessingService {

  async getTaskBarIconNoColor(imageURL: any): Promise<string> {
    const image = await Image.load(imageURL);
    const pngmask = await Image.load('assets/iconMask.png');
    const pngmaskResized = pngmask.resize({width: 300, height: 300});
    const icon = image.rgba8()
      .resize({width: 300, height: 300})
      .subtractImage(pngmaskResized, {channels: [3]});
    return icon.toDataURL();

  }

  async getTaskBarIconWithColor(imageURL: string, color: string): Promise<string> {
    const rgb = this.toRGBA(color);
    const image = await Image.load(imageURL);
    const mask = await Image.load('assets/mask.png');
    const masked = mask.resize({width:300, height:300}).grey().invert().mask();
    const painted = image.rgba8()
      .resize({width: 300, height: 300})
      .paintMasks(masked, {color: rgb});
    return painted.toDataURL();
  }

  async getDummyIcon(): Promise<string> {
    const dummy = await Image.load('assets/icons/CS_logo.png');
    return dummy.toDataURL();
  }

  async getTaskBarColorNoIcon(color: string): Promise<string> {
    const rgb = this.toRGBA(color);
    const image = await Image.load('assets/icons/CS_logo.png');
    const mask = await Image.load('assets/icons/CS_logo_mask.png');
    const masked = mask.resize({width:300, height:300}).grey().invert().mask();
    const painted = image
      .resize({width: 300, height: 300})
      .paintMasks(masked, {color: rgb});
    return painted.toDataURL();
  }

  async toJPEG(blob: Blob): Promise<string> {
    const arrayBuffer = await blob.arrayBuffer();
    const image = await Image.load(await arrayBuffer);
    return image.toDataURL('image/jpeg');
  }

  toRGBA(cssColor) {
    const el = document.createElement('div');
    el.style.color = cssColor;
    el.style.display = 'none';
    document.body.appendChild(el);
    const rgba = window.getComputedStyle(el).getPropertyValue('color');
    el.remove();
    const [r, g, b, a] = rgba.match(/[0-9.]+/g).map(n => Number(n));
    return [r, g, b];
  }
}
