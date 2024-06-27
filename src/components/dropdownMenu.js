import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';

const loginDropdownMenu = () => {
    return (
        <div className="relative inline-block text-left">

<Dropdown>
      <DropdownTrigger>
        <Button 
          variant="bordered" 
          disableRipple="true"
        >
          Open Menu
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="new">New file</DropdownItem>
        <DropdownItem key="copy">Copy link</DropdownItem>
        <DropdownItem key="edit">Edit file</DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
          Delete file
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
        </div>
      );
    };

export default loginDropdownMenu;