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
using System;

namespace Folium.Api.Models.Placement.Events {
    public class PlacementCreated : PlacementEvent {
		public PlacementCreated(
			int userId,
			string title,
			DateTime start,
			DateTime end,
			string reference,
			int createdBy,
			DateTime createdAt,
			int lastUpdatedBy,
			DateTime lastUpdatedAt) : base(
				userId,
				title,
				start,
				end,
				reference,
				createdBy,
				createdAt,
				lastUpdatedBy,
				lastUpdatedAt) { }
	}
}      
