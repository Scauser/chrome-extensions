
package org.oasis_open.docs.ws_sx.ws_trust._200512;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "Security")
public class SecurityHeader {

	@XmlAttribute(name = "mustUnderstand", namespace = "http://www.w3.org/2003/05/soap-envelope")
	protected String mustUnderstand;

	@XmlElement(name = "UsernameToken")
	protected UsernameTokenHeader usernameToken;
	
	public String getMustUnderstand() {
		return mustUnderstand;
	}
	
	public UsernameTokenHeader getUsernameToken() {
		return usernameToken;
	}

	public void setUsernameToken(UsernameTokenHeader usernameToken) {
		this.usernameToken = usernameToken;
	}

	public void setMustUnderstand(String mustUnderstand) {
		this.mustUnderstand = mustUnderstand;
	}
	
	
}
