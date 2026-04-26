import { Pipe, PipeTransform } from "@angular/core";

const DEPT_LABELS: Record<string, string> = {
  HUMAN_RESOURCES:      'Human Resources',
  IT_MIS:               'IT & MIS',
  FINANCE:              'Finance',
  BUSINESS_DEVELOPMENT: 'Business Development',
  BUSINESS_PROCESS:     'Business Process',
  CONTRACTS_COMPLIANCE: 'Contracts and Compliance',
  ENGINEERING_RD:       'Engineering & R&D',
  EXECUTIVE:            'Executive',
  IPP:                  'IPP',
  PROJECTS:             'Projects',
  SUPPLY_CHAIN:         'Supply Chain',
};

@Pipe({ name: 'deptLabel', standalone: true })
export class DeptLabelPipe implements PipeTransform {
  transform(value: string): string {
    return DEPT_LABELS[value] ?? value;
  }
}
