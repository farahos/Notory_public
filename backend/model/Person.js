// models/Person.js
import mongoose from 'mongoose';
const personSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  motherName: { type: String,  },
  birthPlace: { type: String,  },
  birthYear: { type: Number,  },
  address: { type: String,  },
  nationality: { type: String, default: 'Somali' },
  phone: { type: String,  },
  gender : {type : String , enum :["Male","Famale"]},
  documentType: {   
    type: String, 
    enum:  ["Passport", "ID Card", "Niira", "Sugnan", "Laysin"], 
    
  },
  documentNumber: { type: String,  },
  
  createdAt: { type: Date, default: Date.now }
});
const Person = mongoose.model('Person', personSchema);
export default Person;