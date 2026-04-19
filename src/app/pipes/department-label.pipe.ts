import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'deptLabel', standalone: true })
export class DeptLabelPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/_/g, ' ').replace(/\w\S*/g, w =>
      w[0].toUpperCase() + w.slice(1).toLowerCase()
    );
  }
}