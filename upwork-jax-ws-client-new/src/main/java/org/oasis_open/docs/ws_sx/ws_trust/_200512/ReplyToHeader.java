
package org.oasis_open.docs.ws_sx.ws_trust._200512;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ReplyTo")
public class ReplyToHeader {

	@XmlElement(name = "Address", namespace = "http://www.w3.org/2003/05/soap-envelope")
	protected String address;

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}
}
