// place files you want to import through the `$lib` alias in this folder.
export function getOrientation(angleVal: { x: number, y: number, z: number}){
	let orientation = ""
    if(Math.abs(angleVal.x) < 45){      // |x| < 45
        if(Math.abs(angleVal.y) < 45){      // |y| < 45
            if(angleVal.z > 0){          //  z  > 0
                orientation = "Steht";
            }
            else{                        //  z  < 0
                orientation = "Steht (andersrum)";
            }
        }
        else{                         // |y| > 45
            if(angleVal.y > 0){         //  y  > 0
                orientation = "legt sich nach rechts";
            }
            else{                       //  y  < 0
                orientation = "legt sich nach links";
            }
        }
    }
    else{                           // |x| >= 45
        if(angleVal.x > 0){           //  x  >  0
            orientation = "legt sich nach vorner";
        }
        else{                       //  x  <  0
            orientation = "legt sich nach hinten";
        }
    }
    return orientation;
}
