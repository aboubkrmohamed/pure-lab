import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { BranchSettings } from './branch-settings/branch-settings';
import { GeneralSettings } from './general-settings/general-settings';

@Component({
  selector: 'app-admin-tools',
  imports: [RouterLink,BranchSettings, GeneralSettings,MatTabsModule],
  templateUrl: './admin-tools.html',
  styleUrl: './admin-tools.scss',
})
export class AdminTools {

}
