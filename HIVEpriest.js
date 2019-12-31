// Healer

// All option with group
// State - state of group (All or only taunt, or only damager, or not found)
function group(aim, firstMember, secondMember) {
	if (aim == "state") {
		if (firstMember != null && secondMember != null) {
			return 0; // All group
		} else if (firstMember != null && secondMember == null) {
			return 1; // Only taunt
		} else if (firstMember == null && secondMember != null) {
			return 2; // Only damager
		} else {
			return 3; // Group not found
		}
	}
}

// Pick a target
function pickTarget(member = null) {
	let monster = get_target_of(member);
	if (member == null) {
		if (monster && monster.xp > 0 && monster.hp <= character.max_hp + 1000) return monster;
	} else if (member != null) {
		if (monster && monster.hp < monster.max_hp && member.target && monster.id == member.target) return monster;
	}
}

function safePlace(target) {
	
	dist = distance(target, character)
	
	if (!is_in_range(target)) {
		move(character.x+(target.x-character.x)/10,
			 character.y+(target.y-character.y)/10);
		return false;
	} else if (dist < target.range + 20 && target.range + 20 < character.range) {
		let X = null;
		let Y = null;
		
		if (target.x < character.x) X = "left";
		else if (target.x > character.x) X = "right";
		
		if (target.y < character.y) Y = "down";
		else if (target.y > character.y) Y = "up";
		
		if (X == "left") {
			if (Y == "down") {
				move(character.x+5,
					 character.y+5);
			} else if (Y == "up") {
				move(character.x+5,
					 character.y-5);
			}
		} else if (X == "right") {
			if (Y == "down") {
				move(character.x-5,
					 character.y+5);
			} else if (Y == "up") {
				move(character.x-5,
					 character.y-5);
			}
		}
	}
	return true;
}

function attackTarget(target) {
	let check = safePlace(target);
	if (is_in_range(target) && can_attack(target)) {
		/*if (target.hp > 125*2 && character.mp > character.mp_cost*3) {
			if (!is_on_cooldown("curse") && (!target.s["cursed"] || target.s["cursed"] && target.s["cursed"]["ms"]<1)) {
				use_skill("curse");
			}
		}*/
		
		attack(target);
	}
}

// Check targeted monster/player
function checkMonster(member) {
	if (get_target_of(member) != null) return true;
	else return false;
}

// If group not found
function onlyPriest(aim) {
	let target = null;
	if (aim == "gold") target = pickTarget();
	
	if (target && target.hp == target.max_hp && character.mp > 150) {
		attackTarget(target);
	} else if (target && target.hp < target.max_hp) {
		attackTarget(target);
	}
}

// If in group only taunt
function onlyTaunt(firstMember) {
	const taunt = firstMember;
	
	if (!checkMonster(taunt)) {
		if (taunt.hp < taunt.max_hp) {
			heal(taunt);
		}
		if (distance(taunt, character) != 0) {
			move(taunt.x, taunt.y);
		}
	}
}

function allGroup(firstMember, secondMember) {
	const taunt = firstMember;
	const damager = secondMember;
	if (!checkMonster(taunt)) {
		if (taunt.hp < taunt.max_hp-80 && damager.hp >= damager.max_hp-80) heal(taunt);
		if (damager.hp < damager.max_hp-80 && taunt.hp >= taunt.max_hp-80) heal(damager);
		if (damager.hp < damager.max_hp-80 && taunt.hp < taunt.max_hp-80) {
			if(!is_on_cooldown("partyheal"))  {
				use_skill("partyheal");
			}
		}
		if (distance(taunt, character) != 0) {
			move(taunt.x, taunt.y);
		}
	} else {
		if (taunt.hp < taunt.max_hp-80 && damager.hp >= damager.max_hp-80) heal(taunt);
		if (damager.hp < damager.max_hp-80 && taunt.hp >= taunt.max_hp-80) heal(damager);
		if (damager.hp < damager.max_hp-80 && taunt.hp < taunt.max_hp-80) {
			if(!is_on_cooldown("partyheal"))  {
				use_skill("partyheal");
			}
		}
		let target = pickTarget(firstMember);
		if (target && character.mp > 80) attackTarget(target);
	}
}

// Main module of person
function work(firstMember, secondMember, aim) {
	const groupState = group("state", firstMember, secondMember);
	
	if (character.mp < character.max_mp-80) {
		if (!is_on_cooldown("use_mp")) {
			use_skill("use_mp");
		}
	}
	
	if (character.hp < character.max_hp-80) {
		if (!is_on_cooldown("use_hp")) {
			use_skill("use_hp");
		}
	}
	
	if (groupState == 0) allGroup(firstMember, secondMember)
	else if (groupState == 1) onlyTaunt(firstMember);
	else onlyPriest(aim);
}

setInterval(function(){
	loot();
	
	// gold - person will farm gold
	// move - person will attack all mobs on way
	const aim = "gold"
	
	if (aim == "gold") {
		if (character.gold > 9999999) set_message("GOLD: " + character.gold/1000000 + "M");
		else set_message("GOLD: " + character.gold);
	}
	
	const firstMember = get_player("HIVEwarrior")
	const secondMember = get_player("HIVEmage");
	work(firstMember, secondMember, aim);
	
},1000/4);
