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
import { Routes, RouterModule } from "@angular/router";
import { ListPlacementsComponent } from "./list-placements.component";
import { ViewPlacementComponent } from "./view-placement.component";
import { SkillSetResolve } from "../skill-set/resolve.service";

const placementsRoutes: Routes = [
    {
        path: "",
        component: ListPlacementsComponent,
        resolve: {
            skillSet: SkillSetResolve
        }
    },
	{
        path: ":id",
		component: ViewPlacementComponent,
        resolve: {
            skillSet: SkillSetResolve
        }
    }
];

export const placementsRouting = RouterModule.forChild(placementsRoutes);
