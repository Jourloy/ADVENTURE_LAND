function group(aim, firstMember, secondMember) {
	if (aim == "state") {
		if (firstMember != null && secondMember != null) {
			return 0; // All group
		} else if (firstMember != null && secondMember == null) {
			return 1; // Only priest
		} else if (firstMember == null && secondMember != null) {
			return 2; // Only damager
		} else {
			return 3; // Group not found
		}
	}
}

function pickTarget(member = null) {
	let monster = null;
	if (get_target_of(character) == null) {
		if (member != null) monster = get_target_of(member);
		else monster = get_nearest_monster({max_att: 50});
		if (member == null) {
			if (monster && monster.xp > 0) return monster;
		} else if (member != null) {
			if (monster && monster.hp < monster.max_hp && member.target && monster.id == member.target) return monster;
		}
	} else return get_target_of(character)
}

function safePlace(target) {
	
	dist = distance(target, character)
	
	if (!is_in_range(target)) {
		move(character.x+(target.x-character.x)/10,
			 character.y+(target.y-character.y)/10);
		return false;
	}
	return true;
}

function attackTarget(target) {
	let check = safePlace(target);
	if (is_in_range(target) && can_attack(target)) {
		attack(target);
	}
}

function allGroup(firstMember, secondMember, aim) {
	const priest = firstMember;
	const damager = secondMember;
	
	if (aim == "gold") {
        let target = pickTarget();
        if (target && character.mp > 50) {
            attackTarget(target);
        }
    }
}

function work(firstMember, secondMember, aim) {
	const groupState = group("state", firstMember, secondMember);
	
	if (character.mp < character.max_mp-80) {
		if (!is_on_cooldown("use_mp")) {
			use_skill("use_mp");
		}
	}
	
	if (character.hp < character.max_hp-80 && !firstMember) {
		if (!is_on_cooldown("use_hp")) {
			use_skill("use_hp");
		}
	}
	if (character.hp < 500) {
		if (!is_on_cooldown("use_hp")) {
			use_skill("use_hp");
		}
	}
	
	if (groupState == 0) allGroup(firstMember, secondMember, aim)
	else if (groupState == 1) onlyPriets(firstMember);
	else onlyTaunt(aim);
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
	
	const firstMember = get_player("HIVEpriest")
	const secondMember = get_player("HIVEpriest");
	work(firstMember, secondMember, aim);
	
},1000/4);