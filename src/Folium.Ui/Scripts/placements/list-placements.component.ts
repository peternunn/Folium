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
import { Component, OnInit, OnDestroy, Pipe, PipeTransform } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdDialog } from '@angular/material';

import { Subscription } from "rxjs/subscription";

import { Placement, User, Entry } from "./../dtos";
import { UserService } from "./../user/user.service";
import { PlacementsService } from "./placements.service";
import { EntriesService } from "./../entries/entries.service";
import { NotificationService } from "./../common/notification.service";
import { DialogDeleteConfirmComponent } from "./../common/dialog-delete-confirm.component";

@Component({
  templateUrl: "html/placements/list.component.html",
})
export class ListPlacementsComponent implements OnInit, OnDestroy {
  placements: Placement[];
  canLoadPages: boolean = false;
  isNewPlacementOpen: boolean = false; 
  user: User;

  private pageSize: number = 20;
  private page: number = 0;  
  private signedInUser$: Subscription;
  
  constructor(
    private userService: UserService,
    private router: Router,
	  private placementsService: PlacementsService,
		private entriesService: EntriesService,
	  private notificationService: NotificationService,
    private dialog: MdDialog) { }

  ngOnInit() {    
    this.signedInUser$ = this.userService.signedInUser.subscribe(user => {
      this.user = user;        
      this.loadPlacements();
    });
  }

  onNewPlacementClick() {
    this.closeActivePlacement();
    this.isNewPlacementOpen = true;
  }

  onNewPlacementClose(newPlacement: Placement) {
		this.isNewPlacementOpen = false;
    if(newPlacement) {
      this.upsertPlacement(newPlacement);
    }
  }

  loadMorePlacements() {
	  if (!this.canLoadPages) return;
	  this.loadPlacements();
  }

  canModifyPlacement(placement: Placement){
    return this.user.id == placement.userId;
  }

  onSelectPlacementClick(event: Event, placement: Placement) {
	  this.router.navigate(['/placements',placement.id]);
    event.preventDefault();
  }

  onEditPlacementClick(placement: Placement) {
    this.closeActivePlacement();
    // Set the editing flag to change the view.
    placement.editing = true;
  }

  onEditPlacementClose(placement: Placement, updatedPlacement: Placement) {
		placement.editing = false;
    if(updatedPlacement) {
      this.upsertPlacement(updatedPlacement);
    }
  }

  onDeletePlacementClick(placement: Placement) {
    let dialogRef = this.dialog.open(DialogDeleteConfirmComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result === "true") {
        this.placementsService.removePlacement(placement)
            .subscribe(() => {
              this.notificationService.addSuccess("Placement deleted succesfully");
              this.placements = this.placements.filter((p => p.id !== placement.id)); // remove the placement from the array.
            },
            (error: any) => this.notificationService.addDanger(`There was an error trying to remove the placement, please try again.
          ${error}`));
      }
    });
  }

  // Determines if there is a active-element currently open.
  hasActiveElement() {
    return this.isNewPlacementOpen || (this.placements && this.placements.find(e => e.editing) != undefined)
  }

  ngOnDestroy() {
	  this.signedInUser$.unsubscribe();
  }

  private upsertPlacement(placement: Placement) {
    if(this.placements.findIndex(p => p.id == placement.id) >= 0){
      // Edit.
      this.placements = this.placements.map(p => p.id == placement.id ? placement : p);
    } else {
      // New.
      this.placements = this.placements.concat(placement);
    }
  }

  private closeActivePlacement() {
    // Reset all entries to not viewing or editing, which causes any active cards to close.
    this.placements.forEach(entry => {
      entry.editing = false;
    })
  }

  private loadPlacements() {
	  this.page++;
	  this.placementsService.getPlacements(this.page, this.pageSize)
      .subscribe((placements: Placement[]) => {
        if(!this.placements) {
          this.placements = [];
        }
        this.placements = this.placements.concat(placements);
        this.canLoadPages = placements.length === this.pageSize;
      },
      (error: any) => this.notificationService.addDanger(`There was an error trying to load the placements, please try again.
      ${error}`));
  }
}

@Pipe({ name: 'orderByPlacementDate' })
export class OrderByPlacementDatePipe implements PipeTransform {
  transform(placements: Placement[]) {
    return placements.sort((e1, e2) => e2.start.getTime() - e1.start.getTime());
  }
}