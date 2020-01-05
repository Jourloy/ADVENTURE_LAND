

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
		else monster = get_nearest_monster({max_att:70, no_target:true});
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
		move(target.x, target.y);
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
	
	const players = ["HIVEpriest", "HIVEmage"];
    
    for (const name of players) {
        const player = get_player(name);
        
        if (player) {
            if (!player.party) {
                send_party_invite(name);
            }
        }
    }
	
	if (aim == "gold") {
        let target = pickTarget();
        if (target && character.mp > 50) {
            attackTarget(target);
        }
    } else if (aim == "move") {
		if (get_target_of(character) != null && get_target_of(character).hp < get_target_of(character).max_hp) {
			target = pickTarget(character);
			if (target && character.mp > 50) {
				attackTarget(target);
			}
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
}

function change(aim = null) {
	if (aim == "setGold") set("HIVEwarrior", mainAim = "gold");
	if (aim == "setMove") set("HIVEwarrior", mainAim = "move");
	if (aim == "allToMe") {
		set("HIVEpriest", mainAim = "gold");
		set("HIVEmage", mainAim = "gold");
		game_log("Priest: " + get("HIVEpriest"))
		game_log("Mage: " + get("HIVEmage"))
		
	}
	if (aim == "nothing") {
		set("HIVEpriest", mainAim = "move");
		set("HIVEmage", mainAim = "move");
		game_log("Priest: " + get("HIVEpriest"))
		game_log("Mage: " + get("HIVEmage"))
	}
	
}
		
setInterval(function(){
	loot();
	let aim = null;
	// gold - person will farm gold
	// move - person will attack all mobs on way
	map_key("1","snippet",'change("setGold")');
	map_key("2","snippet",'change("setMove")');
	map_key("3","snippet",'change("allToMe")');
	map_key("4","snippet",'change("nothing")');
	
	aim = get("HIVEwarrior");
	if (aim == null) {
		set("HIVEwarrior", mainAim = "move");
	}
	if (aim == "gold") {
		if (character.gold > 9999999) set_message("GOLD: " + character.gold/1000000 + "M");
		else set_message("GOLD: " + character.gold);
	}
	const firstMember = get_player("HIVEpriest")
	const secondMember = get_player("HIVEmage");
	if (get_player("HIVEmerchant")) {
		if (character.items[41] != null) send_item("HIVEmerchant", 41, character.items[41].q)
	}
	if (get_player("HIVEmerchant")) {
		if (!get_player("HIVEmerchant").party) send_party_invite("HIVEmerchant");
	}
	work(firstMember, secondMember, aim);
	
},1000/4);