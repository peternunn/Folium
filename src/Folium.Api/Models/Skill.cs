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
    /// Represents a Skill.
    /// </summary>
    public class Skill {
        public int Id { get; set; } 
        public string Name { get; set; } 
        public bool CanSelfAssess { get; set; } 
        public int? ParentSkillId { get; set; } 
        public int SkillSetId { get; set; } 
        public bool CanSelfCount { get; set; } 
        public int? SelfAssessmentScaleId { get; set; }
        public int? DraftOf { get; set; }
        public string Description { get; set; } 
        public bool Removed { get; set; } 
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; } 
        public int LastUpdatedBy { get; set; }
        public DateTime LastUpdatedAt { get; set; }
		public int? SelfAssessmentLevelId { get; set; }
		public int? Score { get; set; }
		public DateTime? SelfAssessmentCreatedAt { get; set; }
	}
}      
