/** 
 * Copyright 2017 The Royal Veterinary College, jbullock AT rvc.ac.uk
 * 
 * This file is part of Folium.
 * 
 * Folium is free software: you can redistribute it and/or modify 
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * Folium is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Folium.  If not, see <http://www.gnu.org/licenses/>.
*/
import {  Component,
          Input,
          ChangeDetectionStrategy,
          ChangeDetectorRef,
          OnInit,
          OnDestroy,
          Output,
          EventEmitter
        } from "@angular/core";

import { Subscription } from "rxjs/subscription";

import {  SkillSet,
          SkillGroup,
          SelfAssessmentScale,
          SkillFilterFacet,
          Skill,
          SelfAssessmentBundle,
          SelfAssessment
        } from "../dtos";
import { SkillService } from "./skill.service";
import { SkillSetSelectionService } from "../skill-set/selection.service";
import { SkillFiltersService } from "../skills/skill-filters.service";
import { NotificationService } from "../common/notification.service"
import { SkillBundleService } from "./skill-bundle.service";

@Component({
  templateUrl: "html/skills/skill-group-list.component.html",
  selector: "skill-group-list",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillGroupListComponent implements OnInit, OnDestroy {

  filters: SkillFilterFacet[] = [];
  searchTerms: string[] = [];
  selfAssessmentScales: SelfAssessmentScale[];

  private filterFacetUpdated$: Subscription;
  private searchTermsChanged$: Subscription;
  private bundleFilterUpdated$: Subscription;
  private skillSet: SkillSet;

  constructor(
    private skillService: SkillService,
    private skillSetSelectionService: SkillSetSelectionService,
    private skillFiltersService: SkillFiltersService,
	  private changeDetectorRef: ChangeDetectorRef,
	  private notificationService: NotificationService,
    private skillBundleService: SkillBundleService) { }

  @Input()
  autoSave: boolean = false;

  @Input()
  readOnly: boolean = false;
  
  @Input()
  bundleView: boolean = false;

  @Input()
  skillGroups: SkillGroup[];
  
  @Output()
  selfAssessmentChange = new EventEmitter<SelfAssessment>();

  ngOnInit() {
    this.skillSet = this.skillSetSelectionService.skillSet;
    this.filterFacetUpdated$ = this.skillFiltersService.onFilterFacetUpdated.subscribe(f => this.onFilterFacetUpdated());
    this.searchTermsChanged$ = this.skillFiltersService.onSearchTermsChanged.subscribe(s => this.onSearchTermsChanged(s));
    this.bundleFilterUpdated$ = this.skillBundleService.onBundleChange.subscribe(c => {
      if(this.readOnly || this.bundleView) {
        this.applyAssessmentBundleFilter(); // re-apply the bundle filter when the bundle changes,
      }
    });

    this.filters = this.skillFiltersService.filterFacets;
    this.searchTerms = this.skillFiltersService.searchTerms;

    this.skillService.getSelfAssessmentScales(this.skillSet.id)
      .subscribe(selfAssessmentScales => {
        this.selfAssessmentScales = selfAssessmentScales;
        this.changeDetectorRef.markForCheck();
      },
      (error: any) => this.notificationService.addDanger(`There was an error trying to load the self assessment skills, please try again.
        ${error}`)); 

    if (this.readOnly || this.bundleView) {
      this.applyAssessmentBundleFilter();
      this.expandAllSkillGroups();
    } else {
      this.collapseAllSkillGroups();
    }
  }

  getSkillTotalFromGroup(skillGroup: SkillGroup) {
    if (!skillGroup) return -1;
    let total = skillGroup.skills.filter(s => !s.assessment.hidden).length;
    skillGroup.childGroups.forEach(group => {
      total += this.getSkillTotalFromGroup(group);
    });
    return total;
  }

  getSkillTotalFromGroups() {
    // Sum up all totals from the groups.
    return this.skillGroups
      ? this.skillGroups.map(g => this.getSkillTotalFromGroup(g)).reduce((x, y) => x + y, 0)
      : -1;
  }

  onToggleSkillGroup(event: Event, skillGroup: SkillGroup) {
    this.toggleSkillGroup(skillGroup, !skillGroup.expanded);
	  event.preventDefault();
	  event.stopPropagation();
  }

  trackSkillGroup(index, skillGroup: SkillGroup) {
    return skillGroup.id;
  }

  ngOnDestroy() {
    this.filterFacetUpdated$.unsubscribe();
    this.searchTermsChanged$.unsubscribe();
    this.bundleFilterUpdated$.unsubscribe();
  }

  private collapseAllSkillGroups() {
    if (!this.skillGroups) return;
    this.skillGroups.forEach(skillGroup => this.toggleSkillGroup(skillGroup, false));
    this.changeDetectorRef.markForCheck();
  }

  private expandAllSkillGroups() {
    if (!this.skillGroups) return;
    this.skillGroups.forEach(skillGroup => this.toggleSkillGroup(skillGroup, true));
    this.changeDetectorRef.markForCheck();
  }

  private toggleSkillGroup(skillGroup: SkillGroup, expanded: boolean = true) {
    if (!skillGroup) return;
    skillGroup.expanded = expanded;
  }

  private onFilterFacetUpdated() {
    // A filter has updated.
    this.filters = this.skillFiltersService.filterFacets;

    this.collapseAllSkillGroups();
  }

  private onSearchTermsChanged(searchTerms: string[]) {
    // A search term has updated.
    this.searchTerms = this.skillFiltersService.searchTerms;

    this.collapseAllSkillGroups();
    this.changeDetectorRef.markForCheck();
  }

  private applyAssessmentBundleFilter() {
    // Generate the bundle filter and apply it to the current filters.
    let bundleFilter: SkillFilterFacet = {
      id: -1,
      skillFilterId: -1,
      name: "bundled items",
      matchedSkillIds: this.skillBundleService.items,
      selected: true
    };
    this.filters = [bundleFilter];
  }
}