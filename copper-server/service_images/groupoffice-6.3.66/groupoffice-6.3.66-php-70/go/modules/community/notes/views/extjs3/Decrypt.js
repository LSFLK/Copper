var Serpent=Serpent?Serpent:new function(){

var pub={};

var wMax = 0xFFFFFFFF;
var rotw =function(w,n){ return ( w<<n | w>>>(32-n) ) & wMax; }
var getW=function(a,i){ return a[i]|a[i+1]<<8|a[i+2]<<16|a[i+3]<<24; }
var setWInv=function(a,i,w){ a.splice(i,4,w&0xFF,(w>>>8)&0xFF,(w>>>16)&0xFF,(w>>>24)&0xFF); }


// Serpent

var srpKey=[];

var srpK=function(r,a,b,c,d,i){
  r[a]^=srpKey[4*i]; r[b]^=srpKey[4*i+1]; r[c]^=srpKey[4*i+2]; r[d]^=srpKey[4*i+3];
}

var srpLK=function(r,a,b,c,d,e,i){
  r[a]=rotw(r[a],13);r[c]=rotw(r[c],3);r[b]^=r[a];r[e]=(r[a]<<3)&wMax;
  r[d]^=r[c];r[b]^=r[c];r[b]=rotw(r[b],1);r[d]^=r[e];r[d]=rotw(r[d],7);r[e]=r[b];
  r[a]^=r[b];r[e]=(r[e]<<7)&wMax;r[c]^=r[d];r[a]^=r[d];r[c]^=r[e];r[d]^=srpKey[4*i+3];
  r[b]^=srpKey[4*i+1];r[a]=rotw(r[a],5);r[c]=rotw(r[c],22);r[a]^=srpKey[4*i+0];r[c]^=srpKey[4*i+2];
}

var srpKL=function(r,a,b,c,d,e,i){
  r[a]^=srpKey[4*i+0];r[b]^=srpKey[4*i+1];r[c]^=srpKey[4*i+2];r[d]^=srpKey[4*i+3];
  r[a]=rotw(r[a],27);r[c]=rotw(r[c],10);r[e]=r[b];r[c]^=r[d];r[a]^=r[d];r[e]=(r[e]<<7)&wMax;
  r[a]^=r[b];r[b]=rotw(r[b],31);r[c]^=r[e];r[d]=rotw(r[d],25);r[e]=(r[a]<<3)&wMax;
  r[b]^=r[a];r[d]^=r[e];r[a]=rotw(r[a],19);r[b]^=r[c];r[d]^=r[c];r[c]=rotw(r[c],29);
}

var srpS=[
function(r,x0,x1,x2,x3,x4){
  r[x4]=r[x3];r[x3]|=r[x0];r[x0]^=r[x4];r[x4]^=r[x2];r[x4]=~r[x4];r[x3]^=r[x1];
  r[x1]&=r[x0];r[x1]^=r[x4];r[x2]^=r[x0];r[x0]^=r[x3];r[x4]|=r[x0];r[x0]^=r[x2];
  r[x2]&=r[x1];r[x3]^=r[x2];r[x1]=~r[x1];r[x2]^=r[x4];r[x1]^=r[x2];
},
function(r,x0,x1,x2,x3,x4){
  r[x4]=r[x1];r[x1]^=r[x0];r[x0]^=r[x3];r[x3]=~r[x3];r[x4]&=r[x1];r[x0]|=r[x1];
  r[x3]^=r[x2];r[x0]^=r[x3];r[x1]^=r[x3];r[x3]^=r[x4];r[x1]|=r[x4];r[x4]^=r[x2];
  r[x2]&=r[x0];r[x2]^=r[x1];r[x1]|=r[x0];r[x0]=~r[x0];r[x0]^=r[x2];r[x4]^=r[x1];
},
function(r,x0,x1,x2,x3,x4){
  r[x3]=~r[x3];r[x1]^=r[x0];r[x4]=r[x0];r[x0]&=r[x2];r[x0]^=r[x3];r[x3]|=r[x4];
  r[x2]^=r[x1];r[x3]^=r[x1];r[x1]&=r[x0];r[x0]^=r[x2];r[x2]&=r[x3];r[x3]|=r[x1];
  r[x0]=~r[x0];r[x3]^=r[x0];r[x4]^=r[x0];r[x0]^=r[x2];r[x1]|=r[x2];
},
function(r,x0,x1,x2,x3,x4){
  r[x4]=r[x1];r[x1]^=r[x3];r[x3]|=r[x0];r[x4]&=r[x0];r[x0]^=r[x2];r[x2]^=r[x1];r[x1]&=r[x3];
  r[x2]^=r[x3];r[x0]|=r[x4];r[x4]^=r[x3];r[x1]^=r[x0];r[x0]&=r[x3];r[x3]&=r[x4];
  r[x3]^=r[x2];r[x4]|=r[x1];r[x2]&=r[x1];r[x4]^=r[x3];r[x0]^=r[x3];r[x3]^=r[x2];
},
function(r,x0,x1,x2,x3,x4){
  r[x4]=r[x3];r[x3]&=r[x0];r[x0]^=r[x4];r[x3]^=r[x2];r[x2]|=r[x4];r[x0]^=r[x1];
  r[x4]^=r[x3];r[x2]|=r[x0];r[x2]^=r[x1];r[x1]&=r[x0];r[x1]^=r[x4];r[x4]&=r[x2];
  r[x2]^=r[x3];r[x4]^=r[x0];r[x3]|=r[x1];r[x1]=~r[x1];r[x3]^=r[x0];
},
function(r,x0,x1,x2,x3,x4){
  r[x4]=r[x1];r[x1]|=r[x0];r[x2]^=r[x1];r[x3]=~r[x3];r[x4]^=r[x0];r[x0]^=r[x2];
  r[x1]&=r[x4];r[x4]|=r[x3];r[x4]^=r[x0];r[x0]&=r[x3];r[x1]^=r[x3];r[x3]^=r[x2];
  r[x0]^=r[x1];r[x2]&=r[x4];r[x1]^=r[x2];r[x2]&=r[x0];r[x3]^=r[x2];
},
function(r,x0,x1,x2,x3,x4){
  r[x4]=r[x1];r[x3]^=r[x0];r[x1]^=r[x2];r[x2]^=r[x0];r[x0]&=r[x3];r[x1]|=r[x3];
  r[x4]=~r[x4];r[x0]^=r[x1];r[x1]^=r[x2];r[x3]^=r[x4];r[x4]^=r[x0];r[x2]&=r[x0];
  r[x4]^=r[x1];r[x2]^=r[x3];r[x3]&=r[x1];r[x3]^=r[x0];r[x1]^=r[x2];
},
function(r,x0,x1,x2,x3,x4){
  r[x1]=~r[x1];r[x4]=r[x1];r[x0]=~r[x0];r[x1]&=r[x2];r[x1]^=r[x3];r[x3]|=r[x4];r[x4]^=r[x2];
  r[x2]^=r[x3];r[x3]^=r[x0];r[x0]|=r[x1];r[x2]&=r[x0];r[x0]^=r[x4];r[x4]^=r[x3];
  r[x3]&=r[x0];r[x4]^=r[x1];r[x2]^=r[x4];r[x3]^=r[x1];r[x4]|=r[x0];r[x4]^=r[x1];
}];

var srpSI=[
function(r,x0,x1,x2,x3,x4){
  r[x4]=r[x3];r[x1]^=r[x0];r[x3]|=r[x1];r[x4]^=r[x1];r[x0]=~r[x0];r[x2]^=r[x3];
  r[x3]^=r[x0];r[x0]&=r[x1];r[x0]^=r[x2];r[x2]&=r[x3];r[x3]^=r[x4];r[x2]^=r[x3];
  r[x1]^=r[x3];r[x3]&=r[x0];r[x1]^=r[x0];r[x0]^=r[x2];r[x4]^=r[x3];
},
function(r,x0,x1,x2,x3,x4){
  r[x1]^=r[x3];r[x4]=r[x0];r[x0]^=r[x2];r[x2]=~r[x2];r[x4]|=r[x1];r[x4]^=r[x3];
  r[x3]&=r[x1];r[x1]^=r[x2];r[x2]&=r[x4];r[x4]^=r[x1];r[x1]|=r[x3];r[x3]^=r[x0];
  r[x2]^=r[x0];r[x0]|=r[x4];r[x2]^=r[x4];r[x1]^=r[x0];r[x4]^=r[x1];
},
function(r,x0,x1,x2,x3,x4){
  r[x2]^=r[x1];r[x4]=r[x3];r[x3]=~r[x3];r[x3]|=r[x2];r[x2]^=r[x4];r[x4]^=r[x0];
  r[x3]^=r[x1];r[x1]|=r[x2];r[x2]^=r[x0];r[x1]^=r[x4];r[x4]|=r[x3];r[x2]^=r[x3];
  r[x4]^=r[x2];r[x2]&=r[x1];r[x2]^=r[x3];r[x3]^=r[x4];r[x4]^=r[x0];
},
function(r,x0,x1,x2,x3,x4){
  r[x2]^=r[x1];r[x4]=r[x1];r[x1]&=r[x2];r[x1]^=r[x0];r[x0]|=r[x4];r[x4]^=r[x3];
  r[x0]^=r[x3];r[x3]|=r[x1];r[x1]^=r[x2];r[x1]^=r[x3];r[x0]^=r[x2];r[x2]^=r[x3];
  r[x3]&=r[x1];r[x1]^=r[x0];r[x0]&=r[x2];r[x4]^=r[x3];r[x3]^=r[x0];r[x0]^=r[x1];
},
function(r,x0,x1,x2,x3,x4){
  r[x2]^=r[x3];r[x4]=r[x0];r[x0]&=r[x1];r[x0]^=r[x2];r[x2]|=r[x3];r[x4]=~r[x4];
  r[x1]^=r[x0];r[x0]^=r[x2];r[x2]&=r[x4];r[x2]^=r[x0];r[x0]|=r[x4];r[x0]^=r[x3];
  r[x3]&=r[x2];r[x4]^=r[x3];r[x3]^=r[x1];r[x1]&=r[x0];r[x4]^=r[x1];r[x0]^=r[x3];
},
function(r,x0,x1,x2,x3,x4){
  r[x4]=r[x1];r[x1]|=r[x2];r[x2]^=r[x4];r[x1]^=r[x3];r[x3]&=r[x4];r[x2]^=r[x3];r[x3]|=r[x0];
  r[x0]=~r[x0];r[x3]^=r[x2];r[x2]|=r[x0];r[x4]^=r[x1];r[x2]^=r[x4];r[x4]&=r[x0];r[x0]^=r[x1];
  r[x1]^=r[x3];r[x0]&=r[x2];r[x2]^=r[x3];r[x0]^=r[x2];r[x2]^=r[x4];r[x4]^=r[x3];
},
function(r,x0,x1,x2,x3,x4){
  r[x0]^=r[x2];r[x4]=r[x0];r[x0]&=r[x3];r[x2]^=r[x3];r[x0]^=r[x2];r[x3]^=r[x1];
  r[x2]|=r[x4];r[x2]^=r[x3];r[x3]&=r[x0];r[x0]=~r[x0];r[x3]^=r[x1];r[x1]&=r[x2];
  r[x4]^=r[x0];r[x3]^=r[x4];r[x4]^=r[x2];r[x0]^=r[x1];r[x2]^=r[x0];
},
function(r,x0,x1,x2,x3,x4){
  r[x4]=r[x3];r[x3]&=r[x0];r[x0]^=r[x2];r[x2]|=r[x4];r[x4]^=r[x1];r[x0]=~r[x0];r[x1]|=r[x3];
  r[x4]^=r[x0];r[x0]&=r[x2];r[x0]^=r[x1];r[x1]&=r[x2];r[x3]^=r[x2];r[x4]^=r[x3];
  r[x2]&=r[x3];r[x3]|=r[x0];r[x1]^=r[x4];r[x3]^=r[x4];r[x4]&=r[x0];r[x4]^=r[x2];
}];

var srpKc=[7788,63716,84032,7891,78949,25146,28835,67288,84032,40055,7361,1940,77639,27525,24193,75702,
  7361,35413,83150,82383,58619,48468,18242,66861,83150,69667,7788,31552,40054,23222,52496,57565,7788,63716];
var srpEc=[44255,61867,45034,52496,73087,56255,43827,41448,18242,1939,18581,56255,64584,31097,26469,
  77728,77639,4216,64585,31097,66861,78949,58006,59943,49676,78950,5512,78949,27525,52496,18670,76143];
var srpDc=[44255,60896,28835,1837,1057,4216,18242,77301,47399,53992,1939,1940,66420,39172,78950,
  45917,82383,7450,67288,26469,83149,57565,66419,47400,58006,44254,18581,18228,33048,45034,66508,7449];

var keyIt=function(r,a,b,c,d,i){ srpKey[i]=r[b]=rotw(srpKey[a]^r[b]^r[c]^r[d]^0x9e3779b9^i,11); };

var keyLoad=function(r,a,b,c,d,i){ r[a]=srpKey[i]; r[b]=srpKey[i+1]; r[c]=srpKey[i+2]; r[d]=srpKey[i+3]; };

var keyStore=function(r,a,b,c,d,i){ srpKey[i]=r[a]; srpKey[i+1]=r[b]; srpKey[i+2]=r[c]; srpKey[i+3]=r[d]; }

pub.Init = function(key){
  var i,j,m,n;

  //key.reverse();
  if(key.length<32)
	key[key.length]=1;
  while (key.length<32)
    key[key.length]=0;
  for (i=0; i<8; i++){
    srpKey[i] = (key[4*i+0] & 0xff)       | (key[4*i+1] & 0xff) <<  8 |
    (key[4*i+2] & 0xff) << 16 | (key[4*i+3] & 0xff) << 24;
  }

  var r = [srpKey[3],srpKey[4],srpKey[5],srpKey[6],srpKey[7]];

  i=0; j=0;
  while (keyIt(r,j++,0,4,2,i++),keyIt(r,j++,1,0,3,i++),i<132){
    keyIt(r,j++,2,1,4,i++); if (i==8){j=0;}
    keyIt(r,j++,3,2,0,i++); keyIt(r,j++,4,3,1,i++);
  }

  i=128; j=3; n=0;
  while(m=srpKc[n++],srpS[j++%8](r,m%5,m%7,m%11,m%13,m%17),m=srpKc[n],keyStore(r,m%5,m%7,m%11,m%13,i),i>0){
    i-=4; keyLoad(r,m%5,m%7,m%11,m%13,i);
  }
}

pub.Close=function(){
  srpKey=[];
}

pub.Encrypt=function(bData)
{
  var blk = bData.slice(0); //blk.reverse();
  var r=[getW(blk,0),getW(blk,4),getW(blk,8),getW(blk,12)];

  srpK(r,0,1,2,3,0);
  var n=0, m=srpEc[n];
  while (srpS[n%8](r,m%5,m%7,m%11,m%13,m%17),n<31){ m=srpEc[++n]; srpLK(r,m%5,m%7,m%11,m%13,m%17,n); }
  srpK(r,0,1,2,3,32);

  setWInv(bData,0,r[0]);
  setWInv(bData,4,r[1]);
  setWInv(bData,8,r[2]);
  setWInv(bData,12,r[3]);
  
}

pub.Decrypt=function(bData)
{
  var blk = bData.slice(0,16); //blk.reverse();
  var r=[getW(blk,0),getW(blk,4),getW(blk,8),getW(blk,12)];

  srpK(r,0,1,2,3,32);
  var n=0, m=srpDc[n];
  while (srpSI[7-n%8](r,m%5,m%7,m%11,m%13,m%17),n<31){ m=srpDc[++n]; srpKL(r,m%5,m%7,m%11,m%13,m%17,32-n); }
  srpK(r,2,3,1,4,0);

  setWInv(bData,0,r[2]);
  setWInv(bData,4,r[3]);
  setWInv(bData,8,r[1]);
  setWInv(bData,12,r[4]);
  i+=16;
}
return pub;
};

/*
 *  jsaes version 0.1  -  Copyright 2006 B. Poettering
 *
 *  This program is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU General Public License as
 *  published by the Free Software Foundation; either version 2 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *  General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA
 *  02111-1307 USA
 */
var Rijndael=Rijndael?Rijndael: new function(){
/*
 *
 * This is a javascript implementation of the rijndael block cipher. Key lengths 
 * of 128, 192 and 256 bits, and block lengths of 128, 192, and 256 bit in any
 * combination are supported.
 *
 * The well-functioning of the encryption/decryption routines has been 
 * verified for different key lengths with the test vectors given in 
 * FIPS-197, Appendix C.
 *
 * The following code example enciphers the plaintext block '00 11 22 .. EE FF'
 * with the 256 bit key '12345678911234567892123456789312'.
 *
 *    var block = new Array(16);
 *    for(var i = 0; i < 16; i++)
 *        block[i] = 0x11 * i;
 *
 *    var key = '12345678911234567892123456789312';
 *
 *    rijndael.Encrypt(block, key);
 *
 */

/******************************************************************************/

//public
var pub={};

pub.Encrypt=function(block, key) {
	crypt(block,key,true);
}
pub.Decrypt=function(block, key) {
	crypt(block,key,false);
}

//private

var sizes=[16,24,32];

	//key bytes	16,	24,	32		block bytes
var rounds=[[	10,	12,	14],//	16
			[	12,	12,	14],//	24
			[	14,	14,	14]];//	32

var expandedKeys={};//object to keep keys we've already expanded in.

var ExpandKey=function(key) {
  if(!expandedKeys[key]){
	  var kl = key.length, ks, Rcon = 1;
	  ks=15<<5;
	  keyA=new Array(ks);
	  for(var i = 0; i < kl; i++)
		keyA[i]=key.charCodeAt(i);
	  for(var i = kl; i < ks; i += 4) {
		var temp = keyA.slice(i - 4, i);
		if (i % kl == 0) {
		  temp = [	Sbox[temp[1]] ^ Rcon,	Sbox[temp[2]], 
					Sbox[temp[3]], 			Sbox[temp[0]]]; 
		  if ((Rcon <<= 1) >= 256)
			Rcon ^= 0x11b;
		}
		else if ((kl > 24) && (i % kl == 16))
		  temp = [Sbox[temp[0]], Sbox[temp[1]], 
				  Sbox[temp[2]], Sbox[temp[3]]];       
		for(var j = 0; j < 4; j++)
		  keyA[i+j] = keyA[ i+j-kl ] ^ temp[j];
	  }
	  expandedKeys[key]=keyA;
  }
  return expandedKeys[key];
}

var crypt=function(block, key,encrypt) {
  var bB=block.length;
  var kB = key.length;
  var bBi=0;
  var kBi=0;
  switch(bB){
	case 32:bBi++;
	case 24:bBi++;
	case 16:break;
	default: throw 'rijndael: Unsupported block size: '+block.length;
  }
  switch(kB){
	case 32:kBi++;
	case 24:kBi++;
	case 16:break;
	default: throw 'rijndael: Unsupported key size: '+key.length;
  }
  var r=rounds[bBi][kBi];
  key=ExpandKey(key);
  var end=r*bB;
  if(encrypt){
	  AddRoundKey(block, key.slice(0, bB));
	  var SRT=ShiftRowTab[bBi];
	  for(var i = bB; i < end; i += bB) {
		SubBytes(block, Sbox);
		ShiftRows(block, SRT);
		MixColumns(block);
		AddRoundKey(block, key.slice(i, i + bB));
	  }
	  SubBytes(block, Sbox);
	  ShiftRows(block, SRT);
	  AddRoundKey(block, key.slice(i, i+bB));
  }
  else{ //decrypt
	  AddRoundKey(block, key.slice(end, end+bB));
	  var SRT=ShiftRowTab_Inv[bBi];
	  ShiftRows(block, SRT);
	  SubBytes(block, Sbox_Inv);
	  for(var i = end-bB; i >= bB; i -= bB) {
		AddRoundKey(block, key.slice(i, i + bB));
		MixColumns_Inv(block);
		ShiftRows(block, SRT);
		SubBytes(block, Sbox_Inv);
	  }
	  AddRoundKey(block, key.slice(0, bB));
  }
}
/******************************************************************************/

/* The following lookup tables and functions are for internal use only! */
var Sbox = new Array(99,124,119,123,242,107,111,197,48,1,103,43,254,215,171,
  118,202,130,201,125,250,89,71,240,173,212,162,175,156,164,114,192,183,253,
  147,38,54,63,247,204,52,165,229,241,113,216,49,21,4,199,35,195,24,150,5,154,
  7,18,128,226,235,39,178,117,9,131,44,26,27,110,90,160,82,59,214,179,41,227,
  47,132,83,209,0,237,32,252,177,91,106,203,190,57,74,76,88,207,208,239,170,
  251,67,77,51,133,69,249,2,127,80,60,159,168,81,163,64,143,146,157,56,245,
  188,182,218,33,16,255,243,210,205,12,19,236,95,151,68,23,196,167,126,61,
  100,93,25,115,96,129,79,220,34,42,144,136,70,238,184,20,222,94,11,219,224,
  50,58,10,73,6,36,92,194,211,172,98,145,149,228,121,231,200,55,109,141,213,
  78,169,108,86,244,234,101,122,174,8,186,120,37,46,28,166,180,198,232,221,
  116,31,75,189,139,138,112,62,181,102,72,3,246,14,97,53,87,185,134,193,29,
  158,225,248,152,17,105,217,142,148,155,30,135,233,206,85,40,223,140,161,
  137,13,191,230,66,104,65,153,45,15,176,84,187,22);
		//row	0	1	2	3		block Bytes
var rowshifts=[[0,	1,	2,	3],		//16
			   [0,	1,	2,	3],		//24
			   [0,	1,	3,	4]];	//32

var ShiftRowTab = Array(3);
for(var i=0;i<3;i++){
	ShiftRowTab[i]=Array(sizes[i]);
	for(var j=sizes[i];j>=0;j--)
		ShiftRowTab[i][j]=(j+(rowshifts[i][j&3]<<2))%sizes[i];
}
var Sbox_Inv = new Array(256);
  for(var i = 0; i < 256; i++)
    Sbox_Inv[Sbox[i]] = i;
var ShiftRowTab_Inv = Array(3);
for(var i=0;i<3;i++){
	ShiftRowTab_Inv[i]=Array(sizes[i]);
	for(var j=sizes[i];j>=0;j--)
		ShiftRowTab_Inv[i][ShiftRowTab[i][j]]=j;
}
var xtime = new Array(256);
for(var i = 0; i < 128; i++) {
	xtime[i] = i << 1;
	xtime[128 + i] = (i << 1) ^ 0x1b;
}

var SubBytes=function(state, sbox) {
  for(var i = state.length-1; i>=0; i--)
    state[i] = sbox[state[i]];  
}

var AddRoundKey=function (state, rkey) {
  for(var i=state.length-1 ; i >=0 ; i--)
    state[i] ^= rkey[i];
}

var ShiftRows=function(state, shifttab) {
  var h = state.slice(0);
  for(var i = state.length-1 ; i >=0; i--)
    state[i] = h[shifttab[i]];
}

var MixColumns= function(state) {
  for(var i = state.length-4; i >=0; i -= 4) {
    var s0 = state[i + 0], s1 = state[i + 1];
    var s2 = state[i + 2], s3 = state[i + 3];
    var h = s0 ^ s1 ^ s2 ^ s3;
    state[i + 0] ^= h ^ xtime[s0 ^ s1];
    state[i + 1] ^= h ^ xtime[s1 ^ s2];
    state[i + 2] ^= h ^ xtime[s2 ^ s3];
    state[i + 3] ^= h ^ xtime[s3 ^ s0];
  }
}

var MixColumns_Inv=function(state) {
  for(var i = state.length-4; i >=0; i -= 4) {
    var s0 = state[i + 0], s1 = state[i + 1];
    var s2 = state[i + 2], s3 = state[i + 3];
    var h = s0 ^ s1 ^ s2 ^ s3;
    var xh = xtime[h];
    var h1 = xtime[xtime[xh ^ s0 ^ s2]] ^ h;
    var h2 = xtime[xtime[xh ^ s1 ^ s3]] ^ h;
    state[i + 0] ^= h1 ^ xtime[s0 ^ s1];
    state[i + 1] ^= h2 ^ xtime[s1 ^ s2];
    state[i + 2] ^= h1 ^ xtime[s2 ^ s3];
    state[i + 3] ^= h2 ^ xtime[s3 ^ s0];
  }
}
return pub;
};

/*
 *  jsmcrypt version 0.1  -  Copyright 2012 F. Doering
 *
 *  This program is free software; you can redistribute it and/or
 *  modify it under the terms of the GNU General Public License as
 *  published by the Free Software Foundation; either version 2 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *  General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA
 *  02111-1307 USA
 */
 
 
 //this creates a static class mcrypt that is already initialized
 var mcrypt=mcrypt?mcrypt:new function(){
 
 //this allows the user to create instances of this class that keep
 //track of their own key, cipher, and mode
 //calling syntax becomes var myMcrypt=new mcrypt();
 //var mcrypt=function(){
  /**********
 * Private *
 **********/
 
 /************************
 * START OF CIPHER DEFFS *
 ************************/
 
 /* Cipher Data
 * This is an object, keyed with the cipher name whose value is an
 * array containing the number of octets (bytes) in the block size,
 * and the number of octets in the key.
 */
 var ciphers={		//	block size,	key size
  "rijndael-128"	:[	16,			32],
  "rijndael-192"	:[	24,			32],
  "rijndael-256"	:[	32,			32],
  "serpent"			:[	16,			32],
 }
 
 /* blockCipherCalls
 * This object is keyed by the cipher names and the vaules are
 * functions that calls external block ciphers to encypt or
 * decrypt a single block. These functions must have the arguments:
 * function(cipher_name,block,key,encrypt)
 * where: chipher_name is the text of the cipher name,
 * block is an array of inegers representing octets
 * key is a string
 * and encrypt indicates whether it should encrypt or decrypt
 * the block.
 * the function should modify the block as its output
 */
 var blockCipherCalls={};
 blockCipherCalls['rijndael-128']=function(cipher,block,key,encrypt){
		if(key.length<16)
    key+=Array(17-key.length).join(String.fromCharCode(0));
else if(key.length<24 && key.length>16)
    key+=Array(25-key.length).join(String.fromCharCode(0));
else if(key.length<32 && key.length>24)
    key+=Array(33-key.length).join(String.fromCharCode(0));
	if(encrypt)
		Rijndael.Encrypt(block,key);
	else
		Rijndael.Decrypt(block,key);
	return block;
 };
 blockCipherCalls['rijndael-192']=blockCipherCalls['rijndael-128'];
 blockCipherCalls['rijndael-256']=blockCipherCalls['rijndael-128'];
 blockCipherCalls.serpent=function(cipher,block,key,encrypt){
	if(encrypt)
		Serpent.Encrypt(block);
	else
		Serpent.Decrypt(block);
	return block;
 };
 blockCipherCalls.serpent.init=function(cipher,key,encrypt){
	var keyA=[];
	for(var i=0;i<key.length;i++)
		keyA[i]=key.charCodeAt(i);
	Serpent.Init(keyA);
 };
 blockCipherCalls.serpent.deinit=function(cipher,key,encrypt){
	Serpent.Close();
 };
 
 /**********************
 * END OF CIPHER DEFFS *
 **********************/
 
 /*********
 * Public *
 *********/ 
 var pub={};
 
 /* Encrypt
 * This function encypts a plaintext message with an IV, key,  ciphertype, and mode
 * The message, key, and IV should be extended ascii strings
 * the ciphertype should be a string that is a supported cipher (see above)
 * the mode should be a string that is a supported mode of operation
 * the key, cipher type, and mode will default to the last used
 * these can be set without encypting by "encrypting" a null message
 */
 pub.Encrypt=function(message,IV,key, cipher, mode){
	return pub.Crypt(true,message,IV,key, cipher, mode);
};
/* Decrypt
 * See Encrypt for usage
 */ 
 
 pub.Decrypt=function(ctext,IV,key, cipher, mode){
	return pub.Crypt(false,ctext,IV,key, cipher, mode);
 };
/* Crypt
 * This function can encrypt or decrypt text
 */
 
pub.Crypt=function(encrypt,text,IV,key, cipher, mode){
	if(key) cKey=key; else key=cKey;
	if(cipher) cCipher=cipher; else cipher=cCipher;
	if(mode) cMode=mode; else mode=cMode;
	if(!text)
		return true;
	if(blockCipherCalls[cipher].init)
		blockCipherCalls[cipher].init(cipher,key,encrypt);
	var blockS=ciphers[cipher][0];
	var chunkS=blockS;
	var iv=new Array(blockS);
	switch(mode){
		case 'cfb':
			chunkS=1;//8-bit
		case 'cbc':
		case 'ncfb':
		case 'nofb':
		case 'ctr':
			if(!IV)
				throw "mcrypt.Crypt: IV Required for mode "+mode;
			if(IV.length!=blockS)
				throw "mcrypt.Crypt: IV must be "+blockS+" characters long for "+cipher;
			for(var i = blockS-1; i>=0; i--)
				iv[i] = IV.charCodeAt(i);
			break;
		case 'ecb':
			break;
		default:
			throw "mcrypt.Crypt: Unsupported mode of opperation"+cMode;
	}
	var chunks=Math.ceil(text.length/chunkS);
	var orig=text.length;
	text+=Array(chunks*chunkS-orig+1).join(String.fromCharCode(0));//zero pad the end
	var out='';
	switch(mode){
		case 'ecb':
			for(var i = 0; i < chunks; i++){
				for(var j = 0; j < chunkS; j++)
					iv[j]=text.charCodeAt((i*chunkS)+j);
				blockCipherCalls[cipher](cipher,iv, cKey,encrypt);
				for(var j = 0; j < chunkS; j++)
					out+=String.fromCharCode(iv[j]);
			}
			break;
		case 'cbc':
			if(encrypt){
				for(var i = 0; i < chunks; i++){
					for(var j = 0; j < chunkS; j++)
						iv[j]=text.charCodeAt((i*chunkS)+j)^iv[j];
					blockCipherCalls[cipher](cipher,iv, cKey,true);
					for(var j = 0; j < chunkS; j++)
						out+=String.fromCharCode(iv[j]);
				}
			}
			else{
				for(var i = 0; i < chunks; i++){
					var temp=iv;
						iv=new Array(chunkS);
					for(var j = 0; j < chunkS; j++)
						iv[j]=text.charCodeAt((i*chunkS)+j);
					var decr=iv.slice(0);
					blockCipherCalls[cipher](cipher,decr, cKey,false);
					for(var j = 0; j < chunkS; j++)
						out+=String.fromCharCode(temp[j]^decr[j]);
				}
			}
			break;
		case 'cfb':
			for(var i = 0; i < chunks; i++){
				var temp=iv.slice(0);
				blockCipherCalls[cipher](cipher,temp, cKey,true);
				temp=temp[0]^text.charCodeAt(i);
				iv.push(encrypt?temp:text.charCodeAt(i));
				iv.shift();
				out+=String.fromCharCode(temp);
			}
			out=out.substr(0,orig);
			break;
		case 'ncfb':
			for(var i = 0; i < chunks; i++){
				blockCipherCalls[cipher](cipher,iv, cKey,true);
				for(var j = 0; j < chunkS; j++){
					var temp=text.charCodeAt((i*chunkS)+j);
					iv[j]=temp^iv[j];
					out+=String.fromCharCode(iv[j]);
					if(!encrypt)
						iv[j]=temp;
				}
			}
			out=out.substr(0,orig);
			break;
		case 'nofb':
			for(var i = 0; i < chunks; i++){
				blockCipherCalls[cipher](cipher,iv, cKey,true);
				for(var j = 0; j < chunkS; j++)
					out+=String.fromCharCode(text.charCodeAt((i*chunkS)+j)^iv[j]);
			}
			out=out.substr(0,orig);
			break;
		case 'ctr':
			for(var i = 0; i < chunks; i++){
				temp=iv.slice(0);
				blockCipherCalls[cipher](cipher,temp, cKey,true);
				for(var j = 0; j < chunkS; j++)
					out+=String.fromCharCode(text.charCodeAt((i*chunkS)+j)^temp[j]);
				var carry=1;
				var index=chunkS;
				do{
					index--;
					iv[index]+=1;
					carry=iv[index]>>8;
					iv[index]&=255;
				}while(carry)
			}
			out=out.substr(0,orig);
			break;
	}
	if(blockCipherCalls[cipher].deinit)
		blockCipherCalls[cipher].deinit(cipher,key,encrypt);
	return out;
};

//Gets the block size of the specified cipher
pub.get_block_size=function(cipher,mode){
	if(!cipher) cipher=cCipher;
	if(!ciphers[cipher])
		return false;
	return ciphers[cipher][0];
}

//Gets the name of the specified cipher
pub.get_cipher_name=function(cipher){
	if(!cipher) cipher=cCipher;
	if(!ciphers[cipher])
		return false;
	return cipher;
}

//Returns the size of the IV belonging to a specific cipher/mode combination
pub.get_iv_size=function(cipher,mode){
	if(!cipher) cipher=cCipher;
	if(!ciphers[cipher])
		return false;
	return ciphers[cipher][0];
}

//Gets the key size of the specified cipher
pub.get_key_size=function(cipher,mode){
	if(!cipher) cipher=cCipher;
	if(!ciphers[cipher])
		return false;
	return ciphers[cipher][1];
}

//Gets an array of all supported ciphers
pub.list_algorithms=function(){
	var ret=[];
	for(var i in ciphers)
		ret.push(i);
	return ret;
}

pub.list_modes=function(){
	return ['ecb','cbc','cfb','ncfb','nofb','ctr'];
}


 
 /**********
 * Private *
 **********/
  
 var cMode='cbc';
 var cCipher='rijndael-128';
 var cKey='12345678911234567892123456789312';


return pub; 
};
