import React from 'react'
import { Navbar, Nav, NavDropdown, Image, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <Navbar bg='dark' variant='dark' expand='lg'>
      <Link to='/' className='navbar-brand'>
        <Image src='/images/ShopmeAdminSmall.png' alt='Shopme Admin' />
      </Link>
      <Navbar.Toggle aria-controls='topNavbar'>
        <FontAwesomeIcon icon={faBars} />
      </Navbar.Toggle>
      <Navbar.Collapse id='topNavbar'>
        <Nav className='mr-auto'>
          {
            <NavDropdown title='Users' id='users-dropdown'>
              <Link to='/users/new' className='dropdown-item'>
                Create New
              </Link>
              <Link to='/users' className='dropdown-item'>
                View All
              </Link>
            </NavDropdown>
          }

          {
            <>
              <NavDropdown title='Categories' id='categories-dropdown'>
                <Link to='/categories/new' className='dropdown-item'>
                  Create New
                </Link>
                <Link to='/categories' className='dropdown-item'>
                  View All
                </Link>
              </NavDropdown>

              <NavDropdown title='Brands' id='brands-dropdown'>
                <Link to='/brands/new' className='dropdown-item'>
                  Create New
                </Link>
                <Link to='/brands' className='dropdown-item'>
                  View All
                </Link>
              </NavDropdown>

              <NavDropdown title='Products' id='products-dropdown'>
                <Link to='/products/new' className='dropdown-item'>
                  Create New
                </Link>
                <Link to='/products' className='dropdown-item'>
                  View All
                </Link>
              </NavDropdown>
            </>
          }

          {
            <NavDropdown title='Customers' id='customers-dropdown'>
              <Link to='/customers/new' className='dropdown-item'>
                Create New
              </Link>
              <Link to='/customers' className='dropdown-item'>
                View All
              </Link>
            </NavDropdown>
          }

          {
            <NavDropdown title='Orders' id='orders-dropdown'>
              <Link to='/orders' className='dropdown-item'>
                View All
              </Link>
            </NavDropdown>
          }

          {
            <NavDropdown title='Sales Report' id='sales-dropdown'>
              <Link to='/reports/sales-by-date' className='dropdown-item'>
                Sales By Date
              </Link>
              <Link to='/reports/sales-by-category' className='dropdown-item'>
                Sales By Category
              </Link>
              <Link to='/reports/sales-by-product' className='dropdown-item'>
                Sales By Product
              </Link>
            </NavDropdown>
          }

          {
            <NavDropdown title='Reviews' id='reviews-dropdown'>
              <Link to='/reviews' className='dropdown-item'>
                View All
              </Link>
            </NavDropdown>
          }

          {
            <NavDropdown title='Shipping Rates' id='shipping-rates-dropdown'>
              <Link to='/shipping_rates/new' className='dropdown-item'>
                Create New
              </Link>
              <Link to='/shipping_rates' className='dropdown-item'>
                View All
              </Link>
            </NavDropdown>
          }

          {
            <>
              <NavDropdown title='Settings' id='settings-dropdown'>
                <Link to='/settings/general' className='dropdown-item'>
                  General
                </Link>
                <Link to='/settings/countries' className='dropdown-item'>
                  Countries
                </Link>
                <Link to='/settings/states' className='dropdown-item'>
                  States
                </Link>
                <Link to='/settings/mail-server' className='dropdown-item'>
                  Mail Server
                </Link>
                <Link to='/settings/mail-templates' className='dropdown-item'>
                  Mail Templates
                </Link>
                <Link to='/settings/payment' className='dropdown-item'>
                  Payment
                </Link>
              </NavDropdown>
            </>
          }
        </Nav>
        <Nav>
          <NavDropdown title={'Account'} id='account-dropdown' align='end'>
            <Link to='/account' className='dropdown-item'>
              Your Account
            </Link>
            <NavDropdown.Divider />
            <Button variant='link' className='dropdown-item'>
              Logout
            </Button>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
