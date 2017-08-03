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

namespace Folium.Api.Models {
    /// <summary>
    /// Represents a User Activity.
    /// </summary>
    public class UserActivity {
        public int Id { get; set; } 
        public int UserId { get; set; } 
        public UserActivityType Type { get; set; } 
        public DateTime When { get; set; } 
        public string Title { get; set; } 
        public string Link { get; set; }
    }

	public enum UserActivityType {
		SignIn = 1
	}
}      
