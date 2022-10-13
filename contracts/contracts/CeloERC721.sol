// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CeloERC721 is ERC721 {

    //Certificate Struct
    struct certificate_struct {
        string wallet;
        uint256 number;
        uint256 price;
        string location;
        string description;
        string collection;
        string date;
        string image;
    }

    
    uint256 private _certificate_ids;
    mapping(uint256 => certificate_struct) public _certificate_uris; //_certificate_ids => (Certificate) certificate_struct

    constructor(string memory name, string memory symbol)
        ERC721(name, symbol)
    {}

    //Certificate
    function create_certificate(string memory _claimer,  uint256 number, uint256 price,string memory location,string memory description,string memory collection,string memory date, string memory image)
        public
        returns (uint256)
    {
        //Create Certificates into _certificate_uris
        _certificate_uris[_certificate_ids] = certificate_struct(_claimer, number, price, location, description, collection, date, image );
        _certificate_ids++;

        return _certificate_ids;
    }

    function validate_certificate(string memory _claimer,  uint256 number)
        public
        view
        returns (string memory)
    {
        for (uint256 i = 0; i < _certificate_ids; i++){
           if (keccak256(bytes(_claimer)) == keccak256(bytes(_certificate_uris[i].wallet)) && number == _certificate_uris[i].number){
                return Strings.toString(i);
           }				
        }
        return "false";
    }

   
    function reset_all() public {
      _certificate_ids = 0;
      for (uint256 i = 0; i < _certificate_ids; i++)    delete _certificate_uris[i];
    }

  function testing() public returns (string memory){
    create_certificate("0x168e007d9f5a794794e40035c5214963cb16bfb7",35, 300,"Dhaka","A T-shirt with the width of 5 \" and height of 7\" and a bag of 40 celo","T-shirt, bag","2022-10-13T04:06","image url");
    return validate_certificate("0x168e007d9f5a794794e40035c5214963cb16bfb7",35);
  }


}
