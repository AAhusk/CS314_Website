import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

// This just configures Enzyme with tools to parse React components.
Enzyme.configure({ adapter: new Adapter() });
